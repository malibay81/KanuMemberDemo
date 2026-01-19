/**
 * TypeScript interfaces for the Kanu Member Management App
 * These models define the data structure for members, families, and audit logs.
 * Designed to be easily migrated to a backend API in the future.
 */

/**
 * Represents a member of the canoe club
 */
export interface Member {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Personal information */
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date string (YYYY-MM-DD)
  
  /** Address information */
  street: string;
  postalCode: string;
  city: string;
  
  /** Bank details (demo only, no validation) */
  iban: string;
  bic: string;
  
  /** Membership dates */
  entryDate: string; // ISO date string
  exitDate?: string; // Optional, ISO date string
  
  /** Status - members are never deleted, only deactivated */
  isActive: boolean;
  
  /** Family relationship */
  familyId?: string; // Reference to Family.id
  isMainFamilyMember: boolean; // Is this the main member of the family?
  
  /** Metadata */
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

/**
 * Represents a family group for discount calculations
 */
export interface Family {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Family name (usually derived from main member's last name) */
  name: string;
  
  /** Reference to the main family member */
  mainMemberId?: string;
  
  /** Metadata */
  createdAt: string;
  updatedAt: string;
}

/**
 * Types of actions that can be logged
 */
export type AuditActionType = 
  | 'MEMBER_CREATED'
  | 'MEMBER_UPDATED'
  | 'MEMBER_ACTIVATED'
  | 'MEMBER_DEACTIVATED'
  | 'FAMILY_CREATED'
  | 'FAMILY_UPDATED'
  | 'FAMILY_MEMBER_ADDED'
  | 'FAMILY_MEMBER_REMOVED'
  | 'FAMILY_MAIN_MEMBER_CHANGED'
  | 'DATA_IMPORTED'
  | 'DATA_EXPORTED';

/**
 * Represents an audit log entry
 */
export interface AuditLogEntry {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Timestamp of the action */
  timestamp: string; // ISO datetime string
  
  /** Type of action performed */
  action: AuditActionType;
  
  /** ID of the affected member (if applicable) */
  memberId?: string;
  
  /** ID of the affected family (if applicable) */
  familyId?: string;
  
  /** Human-readable description of the action */
  description: string;
  
  /** Additional details (e.g., changed fields) */
  details?: Record<string, unknown>;
}

/**
 * Form data for creating/editing a member
 */
export interface MemberFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  street: string;
  postalCode: string;
  city: string;
  iban: string;
  bic: string;
  entryDate: string;
  exitDate?: string;
  familyId?: string;
  isMainFamilyMember: boolean;
}

/**
 * Filter options for the member list
 */
export interface MemberFilter {
  searchTerm: string;
  showActive: boolean;
  showInactive: boolean;
  familyId?: string;
}

/**
 * CSV row structure for import/export
 */
export interface MemberCSVRow {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  street: string;
  postalCode: string;
  city: string;
  iban: string;
  bic: string;
  entryDate: string;
  exitDate: string;
  isActive: string;
  familyId: string;
  isMainFamilyMember: string;
}

/**
 * Result of a CSV import operation
 */
export interface CSVImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
}
