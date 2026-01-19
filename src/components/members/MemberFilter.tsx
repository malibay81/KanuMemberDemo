/**
 * Member Filter Component
 * Provides filtering options for the member list
 */

import type { MemberFilter as MemberFilterType, Family } from '../../models/types';
import { Input, Select } from '../ui';

interface MemberFilterProps {
  filter: MemberFilterType;
  families: Family[];
  onFilterChange: (filter: MemberFilterType) => void;
}

export function MemberFilter({
  filter,
  families,
  onFilterChange,
}: MemberFilterProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filter, searchTerm: value });
  };
  
  const handleActiveChange = (checked: boolean) => {
    onFilterChange({ ...filter, showActive: checked });
  };
  
  const handleInactiveChange = (checked: boolean) => {
    onFilterChange({ ...filter, showInactive: checked });
  };
  
  const handleFamilyChange = (familyId: string) => {
    onFilterChange({ ...filter, familyId: familyId || undefined });
  };
  
  const handleReset = () => {
    onFilterChange({
      searchTerm: '',
      showActive: true,
      showInactive: true,
      familyId: undefined,
    });
  };
  
  const hasActiveFilters = 
    filter.searchTerm || 
    !filter.showActive || 
    !filter.showInactive || 
    filter.familyId;
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder="Suche nach Name, Ort oder ID..."
            value={filter.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-white"
          />
        </div>
        
        {/* Family Filter */}
        <div className="sm:w-48">
          <Select
            value={filter.familyId || ''}
            onChange={(e) => handleFamilyChange(e.target.value)}
            className="bg-white"
          >
            <option value="">Alle Familien</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Checkboxes */}
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filter.showActive}
              onChange={(e) => handleActiveChange(e.target.checked)}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Aktive
            </span>
          </label>
          
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filter.showInactive}
              onChange={(e) => handleInactiveChange(e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              Inaktive
            </span>
          </label>
        </div>
        
        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
