/**
 * Main Application Component
 * Kanu Member Management Demo App
 */

import { useState, useEffect, type ReactNode } from 'react';
import type { Member, MemberFormData } from './models/types';
import { useMembers } from './hooks/useMembers';
import { useFamilies } from './hooks/useFamilies';
import { initializeExampleData, resetToExampleData } from './services/initService';
import { Button, Card, CardHeader, Modal } from './components/ui';
import { MemberList } from './components/members/MemberList';
import { MemberForm } from './components/members/MemberForm';
import { MemberFilter } from './components/members/MemberFilter';
import { MemberDetails } from './components/members/MemberDetails';
import { CSVImportExport } from './components/members/CSVImportExport';
import { FamilyManager } from './components/families/FamilyManager';
import { AuditLogViewer } from './components/audit/AuditLogViewer';

type TabType = 'members' | 'families' | 'audit' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [memberToToggle, setMemberToToggle] = useState<Member | null>(null);
  
  const {
    members,
    loading,
    filter,
    stats,
    setFilter,
    refreshMembers,
    addMember,
    updateMember,
    toggleMemberStatus,
    getMemberById,
  } = useMembers();
  
  const {
    families,
    refreshFamilies,
    addFamily,
    getFamilyById,
  } = useFamilies();
  
  // Initialize example data on first load
  useEffect(() => {
    initializeExampleData();
  }, []);
  
  // Handlers
  const handleAddMember = () => {
    setSelectedMember(null);
    setIsFormModalOpen(true);
  };
  
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsFormModalOpen(true);
  };
  
  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setIsDetailsModalOpen(true);
  };
  
  const handleToggleStatus = (member: Member) => {
    setMemberToToggle(member);
    setIsConfirmModalOpen(true);
  };
  
  const confirmToggleStatus = () => {
    if (memberToToggle) {
      toggleMemberStatus(memberToToggle.id);
      setIsConfirmModalOpen(false);
      setMemberToToggle(null);
      
      // If details modal is open, refresh the selected member
      if (isDetailsModalOpen && selectedMember?.id === memberToToggle.id) {
        const updated = getMemberById(memberToToggle.id);
        if (updated) setSelectedMember(updated);
      }
    }
  };
  
  const handleFormSubmit = (data: MemberFormData) => {
    if (selectedMember) {
      updateMember(selectedMember.id, data);
    } else {
      addMember(data);
    }
    setIsFormModalOpen(false);
    setSelectedMember(null);
    refreshFamilies();
  };
  
  const handleCreateFamily = (name: string) => {
    addFamily(name);
  };
  
  const handleResetData = () => {
    if (confirm('Möchten Sie wirklich alle Daten zurücksetzen und die Demo-Daten neu laden?')) {
      resetToExampleData();
      refreshMembers();
      refreshFamilies();
    }
  };
  
  const handleImportComplete = () => {
    refreshMembers();
    refreshFamilies();
  };
  
  // Tab navigation
  const tabs: { id: TabType; label: string; icon: ReactNode }[] = [
    {
      id: 'members',
      label: 'Mitglieder',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'families',
      label: 'Familien',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'audit',
      label: 'Historie',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Kanu-Verein Mitgliederverwaltung</h1>
                <p className="text-blue-100 text-sm">Demo-Anwendung</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <div className="bg-white/10 px-3 py-2 rounded-lg">
                <span className="text-blue-100">Gesamt:</span>
                <span className="ml-1 font-semibold">{stats.total}</span>
              </div>
              <div className="bg-green-500/30 px-3 py-2 rounded-lg">
                <span className="text-green-100">Aktiv:</span>
                <span className="ml-1 font-semibold">{stats.active}</span>
              </div>
              <div className="bg-red-500/30 px-3 py-2 rounded-lg">
                <span className="text-red-100">Inaktiv:</span>
                <span className="ml-1 font-semibold">{stats.inactive}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                  transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Mitgliederliste</h2>
              <Button variant="primary" onClick={handleAddMember}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Neues Mitglied
              </Button>
            </div>
            
            {/* Filter */}
            <MemberFilter
              filter={filter}
              families={families}
              onFilterChange={setFilter}
            />
            
            {/* Member List */}
            <Card padding="none">
              <MemberList
                members={members}
                families={families}
                onEdit={handleEditMember}
                onToggleStatus={handleToggleStatus}
                onViewDetails={handleViewDetails}
                loading={loading}
              />
            </Card>
            
            {/* CSV Import/Export */}
            <CSVImportExport onImportComplete={handleImportComplete} />
          </div>
        )}
        
        {/* Families Tab */}
        {activeTab === 'families' && (
          <FamilyManager
            families={families}
            members={members}
            onCreateFamily={handleCreateFamily}
            onRefresh={() => {
              refreshFamilies();
              refreshMembers();
            }}
          />
        )}
        
        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <AuditLogViewer />
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Einstellungen"
                subtitle="Verwalten Sie die Anwendungseinstellungen"
              />
              
              <div className="space-y-6">
                {/* Reset Data */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-800">Daten zurücksetzen</h4>
                    <p className="text-sm text-red-600">
                      Alle Daten löschen und Demo-Daten neu laden. Diese Aktion kann nicht rückgängig gemacht werden.
                    </p>
                  </div>
                  <Button variant="danger" onClick={handleResetData}>
                    Zurücksetzen
                  </Button>
                </div>
                
                {/* Info about the app */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Über diese Demo-App</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Alle Daten werden im LocalStorage des Browsers gespeichert</li>
                    <li>• Keine Verbindung zu einem Backend erforderlich</li>
                    <li>• Mitglieder werden nicht gelöscht, sondern deaktiviert</li>
                    <li>• Alle Änderungen werden im Audit-Log protokolliert</li>
                    <li>• CSV-Import/-Export für Datenaustausch</li>
                    <li>• Familienverknüpfungen für zukünftige Rabattberechnungen</li>
                  </ul>
                </div>
                
                {/* Tech Stack */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Technologie-Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">React</span>
                    <span className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">TypeScript</span>
                    <span className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">Vite</span>
                    <span className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">LocalStorage</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Kanu-Verein Mitgliederverwaltung Demo • Alle Daten werden lokal im Browser gespeichert
          </p>
        </div>
      </footer>
      
      {/* Member Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedMember(null);
        }}
        title={selectedMember ? 'Mitglied bearbeiten' : 'Neues Mitglied anlegen'}
        size="lg"
      >
        <MemberForm
          member={selectedMember || undefined}
          families={families}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setSelectedMember(null);
          }}
        />
      </Modal>
      
      {/* Member Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedMember(null);
        }}
        title="Mitglied Details"
        size="lg"
      >
        {selectedMember && (
          <MemberDetails
            member={selectedMember}
            family={selectedMember.familyId ? getFamilyById(selectedMember.familyId) : undefined}
            onEdit={() => {
              setIsDetailsModalOpen(false);
              setIsFormModalOpen(true);
            }}
            onToggleStatus={() => {
              handleToggleStatus(selectedMember);
            }}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedMember(null);
            }}
          />
        )}
      </Modal>
      
      {/* Confirm Status Toggle Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setMemberToToggle(null);
        }}
        title={memberToToggle?.isActive ? 'Mitglied deaktivieren' : 'Mitglied aktivieren'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            {memberToToggle?.isActive
              ? `Möchten Sie "${memberToToggle?.firstName} ${memberToToggle?.lastName}" wirklich deaktivieren? Das Austrittsdatum wird auf heute gesetzt.`
              : `Möchten Sie "${memberToToggle?.firstName} ${memberToToggle?.lastName}" wieder aktivieren?`
            }
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsConfirmModalOpen(false);
                setMemberToToggle(null);
              }}
            >
              Abbrechen
            </Button>
            <Button
              variant={memberToToggle?.isActive ? 'danger' : 'success'}
              onClick={confirmToggleStatus}
            >
              {memberToToggle?.isActive ? 'Deaktivieren' : 'Aktivieren'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
