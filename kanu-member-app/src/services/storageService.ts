/**
 * LocalStorage Service
 * Handles all data persistence using browser's LocalStorage.
 * This service can be easily replaced with an API service for backend migration.
 */

import type { Member, Family, AuditLogEntry } from '../models/types';

// Storage keys
const STORAGE_KEYS = {
  MEMBERS: 'kanu_members',
  FAMILIES: 'kanu_families',
  AUDIT_LOG: 'kanu_audit_log',
  INITIALIZED: 'kanu_initialized',
} as const;

/**
 * Generic function to get data from LocalStorage
 */
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Generic function to save data to LocalStorage
 */
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
    throw new Error('Failed to save data to storage');
  }
}

// ============================================
// Member Operations
// ============================================

/**
 * Get all members from storage
 */
export function getAllMembers(): Member[] {
  return getFromStorage<Member[]>(STORAGE_KEYS.MEMBERS, []);
}

/**
 * Get a single member by ID
 */
export function getMemberById(id: string): Member | undefined {
  const members = getAllMembers();
  return members.find(m => m.id === id);
}

/**
 * Save a new member
 */
export function saveMember(member: Member): void {
  const members = getAllMembers();
  members.push(member);
  saveToStorage(STORAGE_KEYS.MEMBERS, members);
}

/**
 * Update an existing member
 */
export function updateMember(updatedMember: Member): void {
  const members = getAllMembers();
  const index = members.findIndex(m => m.id === updatedMember.id);
  if (index !== -1) {
    members[index] = updatedMember;
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
  } else {
    throw new Error(`Member with ID ${updatedMember.id} not found`);
  }
}

/**
 * Save multiple members (used for import)
 */
export function saveAllMembers(members: Member[]): void {
  saveToStorage(STORAGE_KEYS.MEMBERS, members);
}

// ============================================
// Family Operations
// ============================================

/**
 * Get all families from storage
 */
export function getAllFamilies(): Family[] {
  return getFromStorage<Family[]>(STORAGE_KEYS.FAMILIES, []);
}

/**
 * Get a single family by ID
 */
export function getFamilyById(id: string): Family | undefined {
  const families = getAllFamilies();
  return families.find(f => f.id === id);
}

/**
 * Save a new family
 */
export function saveFamily(family: Family): void {
  const families = getAllFamilies();
  families.push(family);
  saveToStorage(STORAGE_KEYS.FAMILIES, families);
}

/**
 * Update an existing family
 */
export function updateFamily(updatedFamily: Family): void {
  const families = getAllFamilies();
  const index = families.findIndex(f => f.id === updatedFamily.id);
  if (index !== -1) {
    families[index] = updatedFamily;
    saveToStorage(STORAGE_KEYS.FAMILIES, families);
  } else {
    throw new Error(`Family with ID ${updatedFamily.id} not found`);
  }
}

/**
 * Get all members belonging to a family
 */
export function getFamilyMembers(familyId: string): Member[] {
  const members = getAllMembers();
  return members.filter(m => m.familyId === familyId);
}

/**
 * Save all families (used for import)
 */
export function saveAllFamilies(families: Family[]): void {
  saveToStorage(STORAGE_KEYS.FAMILIES, families);
}

// ============================================
// Audit Log Operations
// ============================================

/**
 * Get all audit log entries
 */
export function getAuditLog(): AuditLogEntry[] {
  return getFromStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOG, []);
}

/**
 * Add a new audit log entry
 */
export function addAuditLogEntry(entry: AuditLogEntry): void {
  const log = getAuditLog();
  log.unshift(entry); // Add to beginning for chronological order (newest first)
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, log);
}

/**
 * Get audit log entries for a specific member
 */
export function getMemberAuditLog(memberId: string): AuditLogEntry[] {
  const log = getAuditLog();
  return log.filter(entry => entry.memberId === memberId);
}

/**
 * Clear all audit log entries (use with caution)
 */
export function clearAuditLog(): void {
  saveToStorage(STORAGE_KEYS.AUDIT_LOG, []);
}

// ============================================
// Initialization
// ============================================

/**
 * Check if the app has been initialized with example data
 */
export function isInitialized(): boolean {
  return getFromStorage<boolean>(STORAGE_KEYS.INITIALIZED, false);
}

/**
 * Mark the app as initialized
 */
export function setInitialized(): void {
  saveToStorage(STORAGE_KEYS.INITIALIZED, true);
}

/**
 * Clear all data (for testing/reset purposes)
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.FAMILIES);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_LOG);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
}
