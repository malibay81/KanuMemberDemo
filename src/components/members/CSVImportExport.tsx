/**
 * CSV Import/Export Component
 * Handles importing and exporting member data as CSV
 */

import { useState, useRef } from 'react';
import { Button, Card } from '../ui';
import { downloadCSV, importMembersFromCSV, generateCSVTemplate } from '../../services/csvService';
import type { CSVImportResult } from '../../models/types';

interface CSVImportExportProps {
  onImportComplete: () => void;
}

export function CSVImportExport({ onImportComplete }: CSVImportExportProps) {
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    const date = new Date().toISOString().split('T')[0];
    downloadCSV(`mitglieder_export_${date}.csv`);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    setImportResult(null);
    
    try {
      const content = await file.text();
      const result = importMembersFromCSV(content);
      setImportResult(result);
      
      if (result.success || result.imported > 0 || result.updated > 0) {
        onImportComplete();
      }
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unbekannter Fehler beim Import'],
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob(['\ufeff' + template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'mitglieder_vorlage.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const clearResult = () => {
    setImportResult(null);
  };
  
  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">CSV Import / Export</h3>
      
      <div className="space-y-4">
        {/* Export Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-700">Export</h4>
            <p className="text-sm text-gray-500">
              Alle Mitglieder inkl. Status und Familien-IDs als CSV exportieren.
            </p>
          </div>
          <Button variant="secondary" onClick={handleExport}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV exportieren
          </Button>
        </div>
        
        <hr className="border-gray-200" />
        
        {/* Import Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-700">Import</h4>
            <p className="text-sm text-gray-500">
              Mitglieder aus CSV importieren. Bestehende Mitglieder werden anhand der ID aktualisiert.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
              Vorlage
            </Button>
            <Button 
              variant="primary" 
              onClick={handleImportClick}
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importiere...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  CSV importieren
                </>
              )}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            aria-label="CSV-Datei auswählen"
            title="CSV-Datei auswählen"
          />
        </div>
        
        {/* Import Result */}
        {importResult && (
          <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`text-sm font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importResult.success ? 'Import erfolgreich' : 'Import mit Fehlern'}
                </h4>
                <div className="mt-1 text-sm text-gray-600">
                  <p>Neu importiert: {importResult.imported}</p>
                  <p>Aktualisiert: {importResult.updated}</p>
                </div>
                {importResult.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-700">Fehler:</p>
                    <ul className="mt-1 text-sm text-red-600 list-disc list-inside max-h-32 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                onClick={clearResult}
                className="text-gray-400 hover:text-gray-600"
                title="Schließen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Help Text */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">CSV-Format:</p>
          <p>Semikolon (;) als Trennzeichen. Erforderliche Spalten: firstName, lastName, birthDate, entryDate.</p>
          <p>Datumsformat: YYYY-MM-DD (z.B. 2024-01-15)</p>
        </div>
      </div>
    </Card>
  );
}
