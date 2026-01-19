/**
 * Member Details Component
 * Shows detailed information about a member including audit history
 */

import { useState, useEffect } from 'react';
import type { Member, Family, AuditLogEntry } from '../../models/types';
import { StatusBadge, Badge, Button, Card } from '../ui';
import { getAuditLogsForMember, formatActionType } from '../../services/auditService';

interface MemberDetailsProps {
  member: Member;
  family?: Family;
  onEdit: () => void;
  onToggleStatus: () => void;
  onClose: () => void;
}

export function MemberDetails({
  member,
  family,
  onEdit,
  onToggleStatus,
  onClose,
}: MemberDetailsProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showAllLogs, setShowAllLogs] = useState(false);
  
  useEffect(() => {
    const logs = getAuditLogsForMember(member.id);
    setAuditLogs(logs);
  }, [member.id]);
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };
  
  const displayedLogs = showAllLogs ? auditLogs : auditLogs.slice(0, 5);
  
  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${member.isActive ? 'bg-blue-600' : 'bg-gray-400'}`}>
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {member.firstName} {member.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge isActive={member.isActive} />
              {member.isMainFamilyMember && family && (
                <Badge variant="info" size="sm">★ Hauptmitglied</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit}>
            Bearbeiten
          </Button>
          <Button
            variant={member.isActive ? 'danger' : 'success'}
            onClick={onToggleStatus}
          >
            {member.isActive ? 'Deaktivieren' : 'Aktivieren'}
          </Button>
        </div>
      </div>
      
      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Persönliche Daten</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Geburtsdatum</dt>
            <dd className="text-sm font-medium text-gray-900">
              {formatDate(member.birthDate)} ({calculateAge(member.birthDate)} Jahre)
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Mitglieds-ID</dt>
            <dd className="text-sm font-mono text-gray-900">{member.id}</dd>
          </div>
        </dl>
      </Card>
      
      {/* Address */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <dt className="text-sm text-gray-500">Straße</dt>
            <dd className="text-sm font-medium text-gray-900">{member.street || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">PLZ</dt>
            <dd className="text-sm font-medium text-gray-900">{member.postalCode || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Ort</dt>
            <dd className="text-sm font-medium text-gray-900">{member.city || '-'}</dd>
          </div>
        </dl>
      </Card>
      
      {/* Bank Details */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bankdaten</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">IBAN</dt>
            <dd className="text-sm font-mono text-gray-900">{member.iban || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">BIC</dt>
            <dd className="text-sm font-mono text-gray-900">{member.bic || '-'}</dd>
          </div>
        </dl>
      </Card>
      
      {/* Membership */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mitgliedschaft</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Eintrittsdatum</dt>
            <dd className="text-sm font-medium text-gray-900">{formatDate(member.entryDate)}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Austrittsdatum</dt>
            <dd className="text-sm font-medium text-gray-900">
              {member.exitDate ? formatDate(member.exitDate) : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Familie</dt>
            <dd className="text-sm font-medium text-gray-900">
              {family ? (
                <Badge variant="info">{family.name}</Badge>
              ) : (
                <span className="text-gray-400">Keine Familienverknüpfung</span>
              )}
            </dd>
          </div>
        </dl>
      </Card>
      
      {/* Audit Log */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Änderungshistorie</h3>
        {auditLogs.length === 0 ? (
          <p className="text-sm text-gray-500">Keine Einträge vorhanden.</p>
        ) : (
          <>
            <div className="space-y-3">
              {displayedLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-sm border-l-2 border-gray-200 pl-3"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {formatActionType(log.action)}
                    </div>
                    <div className="text-gray-500">{log.description}</div>
                    {(() => {
                      const changedFields = log.details?.changedFields;
                      if (changedFields && Array.isArray(changedFields)) {
                        return (
                          <div className="text-xs text-gray-400 mt-1">
                            Geänderte Felder: {(changedFields as string[]).join(', ')}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </div>
                </div>
              ))}
            </div>
            {auditLogs.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllLogs(!showAllLogs)}
                className="mt-4"
              >
                {showAllLogs
                  ? 'Weniger anzeigen'
                  : `Alle ${auditLogs.length} Einträge anzeigen`}
              </Button>
            )}
          </>
        )}
      </Card>
      
      {/* Metadata */}
      <div className="text-xs text-gray-400 text-right">
        Erstellt: {formatDateTime(member.createdAt)} | 
        Zuletzt geändert: {formatDateTime(member.updatedAt)}
      </div>
      
      {/* Close button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose}>
          Schließen
        </Button>
      </div>
    </div>
  );
}
