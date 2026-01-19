/**
 * Member List Component
 * Displays a filterable list of members with actions
 */

import type { Member, Family } from '../../models/types';
import { StatusBadge, Badge, Button } from '../ui';

interface MemberListProps {
  members: Member[];
  families: Family[];
  onEdit: (member: Member) => void;
  onToggleStatus: (member: Member) => void;
  onViewDetails: (member: Member) => void;
  loading?: boolean;
}

export function MemberList({
  members,
  families,
  onEdit,
  onToggleStatus,
  onViewDetails,
  loading = false,
}: MemberListProps) {
  const getFamilyName = (familyId?: string): string | null => {
    if (!familyId) return null;
    const family = families.find(f => f.id === familyId);
    return family?.name || null;
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Lade Mitglieder...</span>
      </div>
    );
  }
  
  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Mitglieder gefunden</h3>
        <p className="mt-1 text-sm text-gray-500">
          Passen Sie die Filter an oder legen Sie ein neues Mitglied an.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      {/* Desktop Table View */}
      <table className="hidden md:table min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ort
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Familie
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Eintritt
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => {
            const familyName = getFamilyName(member.familyId);
            
            return (
              <tr
                key={member.id}
                className={`hover:bg-gray-50 transition-colors ${!member.isActive ? 'bg-gray-50' : ''}`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${member.isActive ? 'bg-blue-600' : 'bg-gray-400'}`}>
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                        {member.isMainFamilyMember && (
                          <span className="ml-2 text-xs text-blue-600">★ Hauptmitglied</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(member.birthDate)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge isActive={member.isActive} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.city || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {familyName ? (
                    <Badge variant="info" size="sm">{familyName}</Badge>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(member.entryDate)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(member)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(member)}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      variant={member.isActive ? 'danger' : 'success'}
                      size="sm"
                      onClick={() => onToggleStatus(member)}
                    >
                      {member.isActive ? 'Deaktivieren' : 'Aktivieren'}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {members.map((member) => {
          const familyName = getFamilyName(member.familyId);
          
          return (
            <div
              key={member.id}
              className={`bg-white rounded-lg border p-4 ${!member.isActive ? 'border-gray-300 bg-gray-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white font-medium ${member.isActive ? 'bg-blue-600' : 'bg-gray-400'}`}>
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(member.birthDate)}
                    </div>
                  </div>
                </div>
                <StatusBadge isActive={member.isActive} size="sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Ort:</span>
                  <span className="ml-1 text-gray-900">{member.city || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Eintritt:</span>
                  <span className="ml-1 text-gray-900">{formatDate(member.entryDate)}</span>
                </div>
                {familyName && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Familie:</span>
                    <Badge variant="info" size="sm" className="ml-2">{familyName}</Badge>
                    {member.isMainFamilyMember && (
                      <span className="ml-2 text-xs text-blue-600">★ Hauptmitglied</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(member)}
                  fullWidth
                >
                  Details
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(member)}
                  fullWidth
                >
                  Bearbeiten
                </Button>
                <Button
                  variant={member.isActive ? 'danger' : 'success'}
                  size="sm"
                  onClick={() => onToggleStatus(member)}
                  fullWidth
                >
                  {member.isActive ? 'Deaktiv.' : 'Aktivieren'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
