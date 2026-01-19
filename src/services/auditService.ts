/**
 * Audit Service
 * Handles logging of all relevant actions in the application.
 * Provides a complete audit trail for member and family operations.
 */

import { v4 as uuidv4 } from 'uuid';
import type { AuditLogEntry, AuditActionType, Member, Family } from '../models/types';
import { addAuditLogEntry, getAuditLog, getMemberAuditLog } from './storageService';

/**
 * Create and save an audit log entry
 */
function logAction(
  action: AuditActionType,
  description: string,
  memberId?: string,
  familyId?: string,
  details?: Record<string, unknown>
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    action,
    description,
    memberId,
    familyId,
    details,
  };
  
  addAuditLogEntry(entry);
  return entry;
}

// ============================================
// Member Audit Functions
// ============================================

/**
 * Log member creation
 */
export function logMemberCreated(member: Member): AuditLogEntry {
  return logAction(
    'MEMBER_CREATED',
    `Mitglied "${member.firstName} ${member.lastName}" wurde erstellt`,
    member.id,
    member.familyId,
    { memberName: `${member.firstName} ${member.lastName}` }
  );
}

/**
 * Log member update
 */
export function logMemberUpdated(
  member: Member,
  changedFields: string[]
): AuditLogEntry {
  return logAction(
    'MEMBER_UPDATED',
    `Mitglied "${member.firstName} ${member.lastName}" wurde aktualisiert`,
    member.id,
    member.familyId,
    { changedFields, memberName: `${member.firstName} ${member.lastName}` }
  );
}

/**
 * Log member activation
 */
export function logMemberActivated(member: Member): AuditLogEntry {
  return logAction(
    'MEMBER_ACTIVATED',
    `Mitglied "${member.firstName} ${member.lastName}" wurde aktiviert`,
    member.id,
    member.familyId,
    { memberName: `${member.firstName} ${member.lastName}` }
  );
}

/**
 * Log member deactivation
 */
export function logMemberDeactivated(member: Member): AuditLogEntry {
  return logAction(
    'MEMBER_DEACTIVATED',
    `Mitglied "${member.firstName} ${member.lastName}" wurde deaktiviert`,
    member.id,
    member.familyId,
    { memberName: `${member.firstName} ${member.lastName}` }
  );
}

// ============================================
// Family Audit Functions
// ============================================

/**
 * Log family creation
 */
export function logFamilyCreated(family: Family): AuditLogEntry {
  return logAction(
    'FAMILY_CREATED',
    `Familie "${family.name}" wurde erstellt`,
    undefined,
    family.id,
    { familyName: family.name }
  );
}

/**
 * Log family update
 */
export function logFamilyUpdated(family: Family): AuditLogEntry {
  return logAction(
    'FAMILY_UPDATED',
    `Familie "${family.name}" wurde aktualisiert`,
    undefined,
    family.id,
    { familyName: family.name }
  );
}

/**
 * Log member added to family
 */
export function logFamilyMemberAdded(member: Member, family: Family): AuditLogEntry {
  return logAction(
    'FAMILY_MEMBER_ADDED',
    `Mitglied "${member.firstName} ${member.lastName}" wurde zur Familie "${family.name}" hinzugefügt`,
    member.id,
    family.id,
    { 
      memberName: `${member.firstName} ${member.lastName}`,
      familyName: family.name 
    }
  );
}

/**
 * Log member removed from family
 */
export function logFamilyMemberRemoved(member: Member, family: Family): AuditLogEntry {
  return logAction(
    'FAMILY_MEMBER_REMOVED',
    `Mitglied "${member.firstName} ${member.lastName}" wurde aus Familie "${family.name}" entfernt`,
    member.id,
    family.id,
    { 
      memberName: `${member.firstName} ${member.lastName}`,
      familyName: family.name 
    }
  );
}

/**
 * Log main family member change
 */
export function logFamilyMainMemberChanged(
  family: Family,
  newMainMember: Member
): AuditLogEntry {
  return logAction(
    'FAMILY_MAIN_MEMBER_CHANGED',
    `"${newMainMember.firstName} ${newMainMember.lastName}" ist jetzt Hauptmitglied der Familie "${family.name}"`,
    newMainMember.id,
    family.id,
    { 
      memberName: `${newMainMember.firstName} ${newMainMember.lastName}`,
      familyName: family.name 
    }
  );
}

// ============================================
// Import/Export Audit Functions
// ============================================

/**
 * Log data import
 */
export function logDataImported(
  importedCount: number,
  updatedCount: number
): AuditLogEntry {
  return logAction(
    'DATA_IMPORTED',
    `Daten importiert: ${importedCount} neue Mitglieder, ${updatedCount} aktualisiert`,
    undefined,
    undefined,
    { importedCount, updatedCount }
  );
}

/**
 * Log data export
 */
export function logDataExported(memberCount: number): AuditLogEntry {
  return logAction(
    'DATA_EXPORTED',
    `${memberCount} Mitglieder wurden exportiert`,
    undefined,
    undefined,
    { memberCount }
  );
}

// ============================================
// Query Functions
// ============================================

/**
 * Get all audit log entries
 */
export function getAllAuditLogs(): AuditLogEntry[] {
  return getAuditLog();
}

/**
 * Get audit log entries for a specific member
 */
export function getAuditLogsForMember(memberId: string): AuditLogEntry[] {
  return getMemberAuditLog(memberId);
}

/**
 * Get recent audit log entries
 */
export function getRecentAuditLogs(limit: number = 50): AuditLogEntry[] {
  const logs = getAuditLog();
  return logs.slice(0, limit);
}

/**
 * Format action type for display
 */
export function formatActionType(action: AuditActionType): string {
  const actionLabels: Record<AuditActionType, string> = {
    'MEMBER_CREATED': 'Mitglied erstellt',
    'MEMBER_UPDATED': 'Mitglied aktualisiert',
    'MEMBER_ACTIVATED': 'Mitglied aktiviert',
    'MEMBER_DEACTIVATED': 'Mitglied deaktiviert',
    'FAMILY_CREATED': 'Familie erstellt',
    'FAMILY_UPDATED': 'Familie aktualisiert',
    'FAMILY_MEMBER_ADDED': 'Familienmitglied hinzugefügt',
    'FAMILY_MEMBER_REMOVED': 'Familienmitglied entfernt',
    'FAMILY_MAIN_MEMBER_CHANGED': 'Hauptmitglied geändert',
    'DATA_IMPORTED': 'Daten importiert',
    'DATA_EXPORTED': 'Daten exportiert',
  };
  return actionLabels[action] || action;
}
