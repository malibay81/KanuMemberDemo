/**
 * Member Form Component
 * Used for creating and editing members
 */

import { useState, useEffect } from 'react';
import type { Member, MemberFormData, Family } from '../../models/types';
import { Button, Input, Select } from '../ui';

interface MemberFormProps {
  member?: Member;
  families: Family[];
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MemberForm({
  member,
  families,
  onSubmit,
  onCancel,
  isLoading = false,
}: MemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    street: '',
    postalCode: '',
    city: '',
    iban: '',
    bic: '',
    entryDate: new Date().toISOString().split('T')[0],
    exitDate: undefined,
    familyId: undefined,
    isMainFamilyMember: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});
  
  // Initialize form with member data if editing
  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName,
        lastName: member.lastName,
        birthDate: member.birthDate,
        street: member.street,
        postalCode: member.postalCode,
        city: member.city,
        iban: member.iban,
        bic: member.bic,
        entryDate: member.entryDate,
        exitDate: member.exitDate,
        familyId: member.familyId,
        isMainFamilyMember: member.isMainFamilyMember,
      });
    }
  }, [member]);
  
  const handleChange = (field: keyof MemberFormData, value: string | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Geburtsdatum ist erforderlich';
    }
    if (!formData.entryDate) {
      newErrors.entryDate = 'Eintrittsdatum ist erforderlich';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Persönliche Daten</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Vorname"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            required
            disabled={isLoading}
          />
          <Input
            label="Nachname"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            required
            disabled={isLoading}
          />
          <Input
            label="Geburtsdatum"
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            error={errors.birthDate}
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Address */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Adresse</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Straße und Hausnummer"
              value={formData.street}
              onChange={(e) => handleChange('street', e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Input
            label="PLZ"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            disabled={isLoading}
          />
          <Input
            label="Ort"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Bank Details */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Bankdaten (Demo)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="IBAN"
            value={formData.iban}
            onChange={(e) => handleChange('iban', e.target.value)}
            placeholder="DE89 3704 0044 0532 0130 00"
            disabled={isLoading}
          />
          <Input
            label="BIC"
            value={formData.bic}
            onChange={(e) => handleChange('bic', e.target.value)}
            placeholder="COBADEFFXXX"
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Membership Dates */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Mitgliedschaft</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Eintrittsdatum"
            type="date"
            value={formData.entryDate}
            onChange={(e) => handleChange('entryDate', e.target.value)}
            error={errors.entryDate}
            required
            disabled={isLoading}
          />
          <Input
            label="Austrittsdatum"
            type="date"
            value={formData.exitDate || ''}
            onChange={(e) => handleChange('exitDate', e.target.value || undefined)}
            helperText="Optional - nur bei Austritt"
            disabled={isLoading}
          />
        </div>
      </div>
      
      {/* Family Assignment */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Familienverknüpfung</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Familie"
            value={formData.familyId || ''}
            onChange={(e) => handleChange('familyId', e.target.value || undefined)}
            disabled={isLoading}
          >
            <option value="">Keine Familie</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </Select>
          
          {formData.familyId && (
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMainFamilyMember}
                  onChange={(e) => handleChange('isMainFamilyMember', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Hauptmitglied der Familie
                </span>
              </label>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Familienmitglieder können für zukünftige Rabattberechnungen verknüpft werden.
        </p>
      </div>
      
      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Speichern...' : member ? 'Änderungen speichern' : 'Mitglied anlegen'}
        </Button>
      </div>
    </form>
  );
}
