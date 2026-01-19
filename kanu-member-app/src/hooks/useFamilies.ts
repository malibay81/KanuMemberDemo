/**
 * Custom hook for family management
 * Provides state management and operations for families
 */

import { useState, useCallback, useEffect } from 'react';
import type { Family, Member } from '../models/types';
import {
  getFamilies,
  getFamily,
  createFamily,
  getMembersOfFamily,
  updateFamilyMainMember,
  removeMemberFromFamily,
} from '../services/memberService';

export interface UseFamiliesReturn {
  families: Family[];
  loading: boolean;
  error: string | null;
  refreshFamilies: () => void;
  addFamily: (name: string, mainMemberId?: string) => Family;
  getFamilyById: (id: string) => Family | undefined;
  getFamilyMembers: (familyId: string) => Member[];
  setMainMember: (familyId: string, memberId: string) => void;
  removeMember: (memberId: string) => void;
}

export function useFamilies(): UseFamiliesReturn {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all families
  const refreshFamilies = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const allFamilies = getFamilies();
      setFamilies(allFamilies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Familien');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshFamilies();
  }, [refreshFamilies]);

  // Add a new family
  const addFamily = useCallback((name: string, mainMemberId?: string): Family => {
    const newFamily = createFamily(name, mainMemberId);
    refreshFamilies();
    return newFamily;
  }, [refreshFamilies]);

  // Get a single family by ID
  const getFamilyById = useCallback((id: string): Family | undefined => {
    return getFamily(id);
  }, []);

  // Get members of a family
  const getFamilyMembers = useCallback((familyId: string): Member[] => {
    return getMembersOfFamily(familyId);
  }, []);

  // Set the main member of a family
  const setMainMember = useCallback((familyId: string, memberId: string): void => {
    updateFamilyMainMember(familyId, memberId);
    refreshFamilies();
  }, [refreshFamilies]);

  // Remove a member from their family
  const removeMember = useCallback((memberId: string): void => {
    removeMemberFromFamily(memberId);
    refreshFamilies();
  }, [refreshFamilies]);

  return {
    families,
    loading,
    error,
    refreshFamilies,
    addFamily,
    getFamilyById,
    getFamilyMembers,
    setMainMember,
    removeMember,
  };
}
