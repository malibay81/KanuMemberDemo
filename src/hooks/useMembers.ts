/**
 * Custom hook for member management
 * Provides state management and operations for members
 */

import { useState, useCallback, useEffect } from 'react';
import type { Member, MemberFormData, MemberFilter } from '../models/types';
import {
  getMembers,
  getMember,
  createMember,
  editMember,
  activateMember,
  deactivateMember,
  getMemberStats,
} from '../services/memberService';

export interface UseMembersReturn {
  members: Member[];
  loading: boolean;
  error: string | null;
  filter: MemberFilter;
  stats: {
    total: number;
    active: number;
    inactive: number;
    familyCount: number;
  };
  setFilter: (filter: MemberFilter) => void;
  refreshMembers: () => void;
  addMember: (data: MemberFormData) => Member;
  updateMember: (id: string, data: MemberFormData) => Member;
  toggleMemberStatus: (id: string) => Member;
  getMemberById: (id: string) => Member | undefined;
}

const defaultFilter: MemberFilter = {
  searchTerm: '',
  showActive: true,
  showInactive: true,
  familyId: undefined,
};

export function useMembers(): UseMembersReturn {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MemberFilter>(defaultFilter);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    familyCount: 0,
  });

  // Load members with current filter
  const refreshMembers = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const filteredMembers = getMembers(filter);
      setMembers(filteredMembers);
      setStats(getMemberStats());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Mitglieder');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Initial load and reload on filter change
  useEffect(() => {
    refreshMembers();
  }, [refreshMembers]);

  // Add a new member
  const addMember = useCallback((data: MemberFormData): Member => {
    const newMember = createMember(data);
    refreshMembers();
    return newMember;
  }, [refreshMembers]);

  // Update an existing member
  const updateMember = useCallback((id: string, data: MemberFormData): Member => {
    const updatedMember = editMember(id, data);
    refreshMembers();
    return updatedMember;
  }, [refreshMembers]);

  // Toggle member active status
  const toggleMemberStatus = useCallback((id: string): Member => {
    const member = getMember(id);
    if (!member) {
      throw new Error(`Mitglied mit ID ${id} nicht gefunden`);
    }
    
    const updatedMember = member.isActive
      ? deactivateMember(id)
      : activateMember(id);
    
    refreshMembers();
    return updatedMember;
  }, [refreshMembers]);

  // Get a single member by ID
  const getMemberById = useCallback((id: string): Member | undefined => {
    return getMember(id);
  }, []);

  return {
    members,
    loading,
    error,
    filter,
    stats,
    setFilter,
    refreshMembers,
    addMember,
    updateMember,
    toggleMemberStatus,
    getMemberById,
  };
}
