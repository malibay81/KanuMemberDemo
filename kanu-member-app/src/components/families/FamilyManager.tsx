/**
 * Family Manager Component
 * Handles creating and managing family groups
 */

import { useState } from 'react';
import type { Family, Member } from '../../models/types';
import { Button, Card, Input, Badge, Modal } from '../ui';

interface FamilyManagerProps {
  families: Family[];
  members: Member[];
  onCreateFamily: (name: string) => void;
  onRefresh: () => void;
}

export function FamilyManager({
  families,
  members,
  onCreateFamily,
  onRefresh,
}: FamilyManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [error, setError] = useState('');
  
  const getFamilyMembers = (familyId: string): Member[] => {
    return members.filter(m => m.familyId === familyId);
  };
  
  const getMainMember = (family: Family): Member | undefined => {
    if (!family.mainMemberId) return undefined;
    return members.find(m => m.id === family.mainMemberId);
  };
  
  const handleCreateFamily = () => {
    if (!newFamilyName.trim()) {
      setError('Bitte geben Sie einen Familiennamen ein');
      return;
    }
    
    onCreateFamily(newFamilyName.trim());
    setNewFamilyName('');
    setError('');
    setIsCreateModalOpen(false);
    onRefresh();
  };
  
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setNewFamilyName('');
    setError('');
  };
  
  return (
    <>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Familien</h3>
            <p className="text-sm text-gray-500">
              Verwalten Sie Familiengruppen für zukünftige Rabattberechnungen
            </p>
          </div>
          <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Neue Familie
          </Button>
        </div>
        
        {families.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Familien</h3>
            <p className="mt-1 text-sm text-gray-500">
              Erstellen Sie eine Familie, um Mitglieder zu verknüpfen.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {families.map((family) => {
              const familyMembers = getFamilyMembers(family.id);
              const mainMember = getMainMember(family);
              const activeMembers = familyMembers.filter(m => m.isActive);
              
              return (
                <div
                  key={family.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{family.name}</h4>
                      <p className="text-sm text-gray-500">
                        {familyMembers.length} Mitglied{familyMembers.length !== 1 ? 'er' : ''}
                      </p>
                    </div>
                    <Badge variant={activeMembers.length > 0 ? 'success' : 'gray'} size="sm">
                      {activeMembers.length} aktiv
                    </Badge>
                  </div>
                  
                  {mainMember && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                      <span className="text-blue-600">★ Hauptmitglied:</span>
                      <span className="ml-1 text-gray-900">
                        {mainMember.firstName} {mainMember.lastName}
                      </span>
                    </div>
                  )}
                  
                  {familyMembers.length > 0 && (
                    <div className="space-y-1">
                      {familyMembers.slice(0, 4).map((member) => (
                        <div
                          key={member.id}
                          className={`text-sm flex items-center gap-2 ${!member.isActive ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                          {member.firstName} {member.lastName}
                          {member.isMainFamilyMember && (
                            <span className="text-xs text-blue-600">★</span>
                          )}
                        </div>
                      ))}
                      {familyMembers.length > 4 && (
                        <div className="text-sm text-gray-400">
                          +{familyMembers.length - 4} weitere
                        </div>
                      )}
                    </div>
                  )}
                  
                  {familyMembers.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      Keine Mitglieder zugeordnet
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Info about family discounts */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Hinweis zu Familienrabatten</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Die Familienverknüpfung dient als Grundlage für zukünftige Rabattberechnungen. 
                Die Rabattlogik selbst ist in dieser Demo-Version noch nicht implementiert.
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Create Family Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Neue Familie erstellen"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Familienname"
            value={newFamilyName}
            onChange={(e) => {
              setNewFamilyName(e.target.value);
              setError('');
            }}
            placeholder="z.B. Familie Müller"
            error={error}
            autoFocus
          />
          <p className="text-sm text-gray-500">
            Nach dem Erstellen können Sie Mitglieder über deren Bearbeitungsformular 
            dieser Familie zuordnen.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={handleCreateFamily}>
              Familie erstellen
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
