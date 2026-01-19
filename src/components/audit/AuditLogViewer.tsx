/**
 * Audit Log Viewer Component
 * Displays the history of all actions in the application
 */

import { useState, useEffect } from 'react';
import type { AuditLogEntry } from '../../models/types';
import { Card, Badge, Button } from '../ui';
import { getRecentAuditLogs, formatActionType } from '../../services/auditService';

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  
  useEffect(() => {
    const allLogs = getRecentAuditLogs(100);
    setLogs(allLogs);
  }, []);
  
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  const getActionBadgeVariant = (action: string): 'success' | 'danger' | 'warning' | 'info' | 'gray' => {
    if (action.includes('CREATED')) return 'success';
    if (action.includes('DEACTIVATED') || action.includes('REMOVED')) return 'danger';
    if (action.includes('ACTIVATED') || action.includes('ADDED')) return 'success';
    if (action.includes('UPDATED') || action.includes('CHANGED')) return 'warning';
    if (action.includes('IMPORT') || action.includes('EXPORT')) return 'info';
    return 'gray';
  };
  
  const displayedLogs = logs.slice(0, displayCount);
  const hasMore = logs.length > displayCount;
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };
  
  const handleRefresh = () => {
    const allLogs = getRecentAuditLogs(100);
    setLogs(allLogs);
  };
  
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Änderungshistorie</h3>
          <p className="text-sm text-gray-500">
            Protokoll aller Aktionen im System ({logs.length} Einträge)
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Aktualisieren
        </Button>
      </div>
      
      {logs.length === 0 ? (
        <div className="text-center py-8">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Einträge</h3>
          <p className="mt-1 text-sm text-gray-500">
            Es wurden noch keine Aktionen protokolliert.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <Badge variant={getActionBadgeVariant(log.action)} size="sm">
                    {formatActionType(log.action)}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{log.description}</p>
                  {log.details && (
                    <div className="mt-1 text-xs text-gray-500">
                      {(() => {
                        const details = log.details;
                        if (details.changedFields && Array.isArray(details.changedFields)) {
                          return <span>Geänderte Felder: {(details.changedFields as string[]).join(', ')}</span>;
                        }
                        if (details.importedCount !== undefined) {
                          return <span>Importiert: {String(details.importedCount)}, Aktualisiert: {String(details.updatedCount)}</span>;
                        }
                        if (details.memberCount !== undefined) {
                          return <span>Exportierte Mitglieder: {String(details.memberCount)}</span>;
                        }
                        return null;
                      })()}
                    </div>
                  )}
                  {log.memberId && (
                    <p className="mt-1 text-xs text-gray-400 font-mono">
                      Mitglied-ID: {log.memberId}
                    </p>
                  )}
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDateTime(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={handleLoadMore}>
                Weitere {Math.min(20, logs.length - displayCount)} Einträge laden
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Info about audit log */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Über das Audit-Log</h4>
            <p className="text-sm text-blue-700 mt-1">
              Alle relevanten Aktionen werden automatisch protokolliert: Erstellung, Änderungen, 
              Aktivierung/Deaktivierung von Mitgliedern sowie Familienverknüpfungen und Datenimporte/-exporte.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
