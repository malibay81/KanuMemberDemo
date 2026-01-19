/**
 * Member Service
 * Handles all member-related business logic.
 * Acts as an intermediary between components and storage.
 */

import { v4 as uuidv4 } from 'uuid';
import type { Member, MemberFormData, MemberFilter, Family } from '../models/types';
import {
  getAllMembers,
  getMemberById,
  saveMember,
  updateMember,
  getAllFamilies,
  getFamilyById,
  saveFamily,
  updateFamily,
  getFamilyMembers,
  saveAllMembers,
  saveAllFamilies,
} from './storageService';
import {
  logMemberCreated,
  logMemberUpdated,
  logMemberActivated,
  logMemberDeactivated,
  logFamilyCreated,
  logFamilyMemberAdded,
  logFamilyMemberRemoved,
  logFamilyMainMemberChanged,
} from './auditService';

// ============================================
// Member Operations
// ============================================

/**
 * Create a new member
 */
export function createMember(formData: MemberFormData): Member {
  const now = new Date().toISOString();
  
  const member: Member = {
    id: uuidv4(),
    firstName: formData.firstName,
    lastName: formData.lastName,
    birthDate: formData.birthDate,
    street: formData.street,
    postalCode: formData.postalCode,
    city: formData.city,
    iban: formData.iban,
    bic: formData.bic,
    entryDate: formData.entryDate,
    exitDate: formData.exitDate,
    isActive: true,
    familyId: formData.familyId,
    isMainFamilyMember: formData.isMainFamilyMember,
    createdAt: now,
    updatedAt: now,
  };
  
  saveMember(member);
  logMemberCreated(member);
  
  // Handle family assignment
  if (formData.familyId) {
    const family = getFamilyById(formData.familyId);
    if (family) {
      logFamilyMemberAdded(member, family);
      
      // If this is the main member, update the family
      if (formData.isMainFamilyMember) {
        updateFamilyMainMember(family.id, member.id);
      }
    }
  }
  
  return member;
}

/**
 * Update an existing member
 */
export function editMember(id: string, formData: MemberFormData): Member {
  const existingMember = getMemberById(id);
  if (!existingMember) {
    throw new Error(`Member with ID ${id} not found`);
  }
  
  // Track changed fields for audit log
  const changedFields: string[] = [];
  if (existingMember.firstName !== formData.firstName) changedFields.push('Vorname');
  if (existingMember.lastName !== formData.lastName) changedFields.push('Nachname');
  if (existingMember.birthDate !== formData.birthDate) changedFields.push('Geburtsdatum');
  if (existingMember.street !== formData.street) changedFields.push('Straße');
  if (existingMember.postalCode !== formData.postalCode) changedFields.push('PLZ');
  if (existingMember.city !== formData.city) changedFields.push('Ort');
  if (existingMember.iban !== formData.iban) changedFields.push('IBAN');
  if (existingMember.bic !== formData.bic) changedFields.push('BIC');
  if (existingMember.entryDate !== formData.entryDate) changedFields.push('Eintrittsdatum');
  if (existingMember.exitDate !== formData.exitDate) changedFields.push('Austrittsdatum');
  
  // Handle family changes
  const oldFamilyId = existingMember.familyId;
  const newFamilyId = formData.familyId;
  
  if (oldFamilyId !== newFamilyId) {
    changedFields.push('Familie');
    
    // Remove from old family
    if (oldFamilyId) {
      const oldFamily = getFamilyById(oldFamilyId);
      if (oldFamily) {
        logFamilyMemberRemoved(existingMember, oldFamily);
        
        // If was main member, clear that
        if (existingMember.isMainFamilyMember && oldFamily.mainMemberId === id) {
          oldFamily.mainMemberId = undefined;
          oldFamily.updatedAt = new Date().toISOString();
          updateFamily(oldFamily);
        }
      }
    }
    
    // Add to new family
    if (newFamilyId) {
      const newFamily = getFamilyById(newFamilyId);
      if (newFamily) {
        logFamilyMemberAdded({ ...existingMember, familyId: newFamilyId }, newFamily);
      }
    }
  }
  
  const updatedMember: Member = {
    ...existingMember,
    firstName: formData.firstName,
    lastName: formData.lastName,
    birthDate: formData.birthDate,
    street: formData.street,
    postalCode: formData.postalCode,
    city: formData.city,
    iban: formData.iban,
    bic: formData.bic,
    entryDate: formData.entryDate,
    exitDate: formData.exitDate,
    familyId: formData.familyId,
    isMainFamilyMember: formData.isMainFamilyMember,
    updatedAt: new Date().toISOString(),
  };
  
  updateMember(updatedMember);
  
  if (changedFields.length > 0) {
    logMemberUpdated(updatedMember, changedFields);
  }
  
  // Handle main member status change
  if (formData.isMainFamilyMember && formData.familyId) {
    updateFamilyMainMember(formData.familyId, id);
  }
  
  return updatedMember;
}

/**
 * Activate a member
 */
export function activateMember(id: string): Member {
  const member = getMemberById(id);
  if (!member) {
    throw new Error(`Member with ID ${id} not found`);
  }
  
  const updatedMember: Member = {
    ...member,
    isActive: true,
    exitDate: undefined,
    updatedAt: new Date().toISOString(),
  };
  
  updateMember(updatedMember);
  logMemberActivated(updatedMember);
  
  return updatedMember;
}

/**
 * Deactivate a member (soft delete)
 */
export function deactivateMember(id: string): Member {
  const member = getMemberById(id);
  if (!member) {
    throw new Error(`Member with ID ${id} not found`);
  }
  
  const updatedMember: Member = {
    ...member,
    isActive: false,
    exitDate: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString(),
  };
  
  updateMember(updatedMember);
  logMemberDeactivated(updatedMember);
  
  return updatedMember;
}

/**
 * Get all members with optional filtering
 */
export function getMembers(filter?: MemberFilter): Member[] {
  let members = getAllMembers();
  
  if (filter) {
    // Filter by active status
    if (!filter.showActive && !filter.showInactive) {
      // Show nothing if both are unchecked
      return [];
    } else if (!filter.showActive) {
      members = members.filter(m => !m.isActive);
    } else if (!filter.showInactive) {
      members = members.filter(m => m.isActive);
    }
    
    // Filter by search term
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      members = members.filter(m =>
        m.firstName.toLowerCase().includes(term) ||
        m.lastName.toLowerCase().includes(term) ||
        m.city.toLowerCase().includes(term) ||
        m.id.toLowerCase().includes(term)
      );
    }
    
    // Filter by family
    if (filter.familyId) {
      members = members.filter(m => m.familyId === filter.familyId);
    }
  }
  
  // Sort by last name, then first name
  return members.sort((a, b) => {
    const lastNameCompare = a.lastName.localeCompare(b.lastName);
    if (lastNameCompare !== 0) return lastNameCompare;
    return a.firstName.localeCompare(b.firstName);
  });
}

/**
 * Get a single member by ID
 */
export function getMember(id: string): Member | undefined {
  return getMemberById(id);
}

// ============================================
// Family Operations
// ============================================

/**
 * Create a new family
 */
export function createFamily(name: string, mainMemberId?: string): Family {
  const now = new Date().toISOString();
  
  const family: Family = {
    id: uuidv4(),
    name,
    mainMemberId,
    createdAt: now,
    updatedAt: now,
  };
  
  saveFamily(family);
  logFamilyCreated(family);
  
  return family;
}

/**
 * Get all families
 */
export function getFamilies(): Family[] {
  return getAllFamilies().sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single family by ID
 */
export function getFamily(id: string): Family | undefined {
  return getFamilyById(id);
}

/**
 * Get members of a family
 */
export function getMembersOfFamily(familyId: string): Member[] {
  return getFamilyMembers(familyId);
}

/**
 * Update the main member of a family
 */
export function updateFamilyMainMember(familyId: string, memberId: string): void {
  const family = getFamilyById(familyId);
  if (!family) {
    throw new Error(`Family with ID ${familyId} not found`);
  }
  
  const member = getMemberById(memberId);
  if (!member) {
    throw new Error(`Member with ID ${memberId} not found`);
  }
  
  // Clear isMainFamilyMember from all other family members
  const familyMembers = getFamilyMembers(familyId);
  familyMembers.forEach(m => {
    if (m.id !== memberId && m.isMainFamilyMember) {
      const updated = { ...m, isMainFamilyMember: false, updatedAt: new Date().toISOString() };
      updateMember(updated);
    }
  });
  
  // Update the family
  const updatedFamily: Family = {
    ...family,
    mainMemberId: memberId,
    updatedAt: new Date().toISOString(),
  };
  updateFamily(updatedFamily);
  
  // Update the member
  if (!member.isMainFamilyMember) {
    const updatedMember: Member = {
      ...member,
      isMainFamilyMember: true,
      updatedAt: new Date().toISOString(),
    };
    updateMember(updatedMember);
  }
  
  logFamilyMainMemberChanged(updatedFamily, member);
}

/**
 * Remove a member from their family
 */
export function removeMemberFromFamily(memberId: string): void {
  const member = getMemberById(memberId);
  if (!member || !member.familyId) return;
  
  const family = getFamilyById(member.familyId);
  if (!family) return;
  
  logFamilyMemberRemoved(member, family);
  
  // If this was the main member, clear that
  if (family.mainMemberId === memberId) {
    const updatedFamily: Family = {
      ...family,
      mainMemberId: undefined,
      updatedAt: new Date().toISOString(),
    };
    updateFamily(updatedFamily);
  }
  
  // Update the member
  const updatedMember: Member = {
    ...member,
    familyId: undefined,
    isMainFamilyMember: false,
    updatedAt: new Date().toISOString(),
  };
  updateMember(updatedMember);
}

// ============================================
// Bulk Operations (for import)
// ============================================

/**
 * Save all members (replaces existing data)
 */
export function bulkSaveMembers(members: Member[]): void {
  saveAllMembers(members);
}

/**
 * Save all families (replaces existing data)
 */
export function bulkSaveFamilies(families: Family[]): void {
  saveAllFamilies(families);
}

/**
 * Get member statistics
 */
export function getMemberStats(): {
  total: number;
  active: number;
  inactive: number;
  familyCount: number;
} {
  const members = getAllMembers();
  const families = getAllFamilies();
  
  return {
    total: members.length,
    active: members.filter(m => m.isActive).length,
    inactive: members.filter(m => !m.isActive).length,
    familyCount: families.length,
  };
}
