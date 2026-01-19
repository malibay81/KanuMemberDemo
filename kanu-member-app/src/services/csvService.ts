/**
 * CSV Service
 * Handles CSV import and export functionality for member data.
 */

import { v4 as uuidv4 } from 'uuid';
import type { Member, MemberCSVRow, CSVImportResult } from '../models/types';
import { getAllMembers, saveAllMembers } from './storageService';
import { logDataImported, logDataExported } from './auditService';

// CSV column headers
const CSV_HEADERS = [
  'id',
  'firstName',
  'lastName',
  'birthDate',
  'street',
  'postalCode',
  'city',
  'iban',
  'bic',
  'entryDate',
  'exitDate',
  'isActive',
  'familyId',
  'isMainFamilyMember',
] as const;

/**
 * Export all members to CSV format
 */
export function exportMembersToCSV(): string {
  const members = getAllMembers();
  
  // Create header row
  const headerRow = CSV_HEADERS.join(';');
  
  // Create data rows
  const dataRows = members.map(member => {
    const row: MemberCSVRow = {
      id: member.id,
      firstName: escapeCSVField(member.firstName),
      lastName: escapeCSVField(member.lastName),
      birthDate: member.birthDate,
      street: escapeCSVField(member.street),
      postalCode: member.postalCode,
      city: escapeCSVField(member.city),
      iban: member.iban,
      bic: member.bic,
      entryDate: member.entryDate,
      exitDate: member.exitDate || '',
      isActive: member.isActive ? 'true' : 'false',
      familyId: member.familyId || '',
      isMainFamilyMember: member.isMainFamilyMember ? 'true' : 'false',
    };
    
    return CSV_HEADERS.map(header => row[header]).join(';');
  });
  
  // Log the export
  logDataExported(members.length);
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV as a file
 */
export function downloadCSV(filename: string = 'mitglieder_export.csv'): void {
  const csvContent = exportMembersToCSV();
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV content and import members
 */
export function importMembersFromCSV(csvContent: string): CSVImportResult {
  const result: CSVImportResult = {
    success: true,
    imported: 0,
    updated: 0,
    errors: [],
  };
  
  try {
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length < 2) {
      result.success = false;
      result.errors.push('CSV-Datei enthält keine Daten');
      return result;
    }
    
    // Parse header
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine);
    
    // Validate headers
    const missingHeaders = CSV_HEADERS.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      result.success = false;
      result.errors.push(`Fehlende Spalten: ${missingHeaders.join(', ')}`);
      return result;
    }
    
    // Create header index map
    const headerIndex: Record<string, number> = {};
    headers.forEach((header, index) => {
      headerIndex[header] = index;
    });
    
    // Process data rows
    const existingMembers = getAllMembers();
    const processedMembers: Member[] = [...existingMembers];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const values = parseCSVLine(line);
        const rowData = parseRowToMember(values, headerIndex, i + 1);
        
        if (rowData.errors.length > 0) {
          result.errors.push(...rowData.errors);
          continue;
        }
        
        const member = rowData.member!;
        
        // Check if member exists (by ID)
        const existingIndex = processedMembers.findIndex(m => m.id === member.id);
        
        if (existingIndex !== -1) {
          // Update existing member
          processedMembers[existingIndex] = {
            ...member,
            createdAt: processedMembers[existingIndex].createdAt,
            updatedAt: new Date().toISOString(),
          };
          result.updated++;
        } else {
          // Add new member
          processedMembers.push({
            ...member,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          result.imported++;
        }
      } catch (error) {
        result.errors.push(`Zeile ${i + 1}: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      }
    }
    
    // Save all members
    if (result.imported > 0 || result.updated > 0) {
      saveAllMembers(processedMembers);
      logDataImported(result.imported, result.updated);
    }
    
    if (result.errors.length > 0 && result.imported === 0 && result.updated === 0) {
      result.success = false;
    }
    
  } catch (error) {
    result.success = false;
    result.errors.push(`Import fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
  
  return result;
}

/**
 * Parse a CSV line respecting quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Parse a row of values into a Member object
 */
function parseRowToMember(
  values: string[],
  headerIndex: Record<string, number>,
  rowNumber: number
): { member: Member | null; errors: string[] } {
  const errors: string[] = [];
  
  const getValue = (header: string): string => {
    const index = headerIndex[header];
    return index !== undefined && values[index] !== undefined ? values[index] : '';
  };
  
  // Validate required fields
  const firstName = getValue('firstName');
  const lastName = getValue('lastName');
  const birthDate = getValue('birthDate');
  const entryDate = getValue('entryDate');
  
  if (!firstName) errors.push(`Zeile ${rowNumber}: Vorname fehlt`);
  if (!lastName) errors.push(`Zeile ${rowNumber}: Nachname fehlt`);
  if (!birthDate) errors.push(`Zeile ${rowNumber}: Geburtsdatum fehlt`);
  if (!entryDate) errors.push(`Zeile ${rowNumber}: Eintrittsdatum fehlt`);
  
  // Validate date formats
  if (birthDate && !isValidDate(birthDate)) {
    errors.push(`Zeile ${rowNumber}: Ungültiges Geburtsdatum (Format: YYYY-MM-DD)`);
  }
  if (entryDate && !isValidDate(entryDate)) {
    errors.push(`Zeile ${rowNumber}: Ungültiges Eintrittsdatum (Format: YYYY-MM-DD)`);
  }
  
  const exitDate = getValue('exitDate');
  if (exitDate && !isValidDate(exitDate)) {
    errors.push(`Zeile ${rowNumber}: Ungültiges Austrittsdatum (Format: YYYY-MM-DD)`);
  }
  
  if (errors.length > 0) {
    return { member: null, errors };
  }
  
  // Get or generate ID
  let id = getValue('id');
  if (!id || !isValidUUID(id)) {
    id = uuidv4();
  }
  
  const member: Member = {
    id,
    firstName,
    lastName,
    birthDate,
    street: getValue('street'),
    postalCode: getValue('postalCode'),
    city: getValue('city'),
    iban: getValue('iban'),
    bic: getValue('bic'),
    entryDate,
    exitDate: exitDate || undefined,
    isActive: getValue('isActive').toLowerCase() !== 'false',
    familyId: getValue('familyId') || undefined,
    isMainFamilyMember: getValue('isMainFamilyMember').toLowerCase() === 'true',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return { member, errors: [] };
}

/**
 * Escape a field for CSV (handle quotes and special characters)
 */
function escapeCSVField(field: string): string {
  if (field.includes(';') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

/**
 * Generate a sample CSV template
 */
export function generateCSVTemplate(): string {
  const headerRow = CSV_HEADERS.join(';');
  const sampleRow = [
    '', // id (will be generated)
    'Max',
    'Mustermann',
    '1990-01-15',
    'Musterstraße 1',
    '12345',
    'Musterstadt',
    'DE89370400440532013000',
    'COBADEFFXXX',
    '2024-01-01',
    '', // exitDate
    'true',
    '', // familyId
    'false',
  ].join(';');
  
  return [headerRow, sampleRow].join('\n');
}
