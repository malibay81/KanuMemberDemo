/**
 * Initialization Service
 * Provides example data for the demo application.
 * This data is loaded on first run to demonstrate the app's functionality.
 */

import { v4 as uuidv4 } from 'uuid';
import type { Member, Family } from '../models/types';
import { saveAllMembers, saveAllFamilies, isInitialized, setInitialized } from './storageService';
import { logMemberCreated, logFamilyCreated } from './auditService';

/**
 * Initialize the application with example data
 */
export function initializeExampleData(): void {
  if (isInitialized()) {
    return; // Already initialized
  }
  
  // Create families first
  const families = createExampleFamilies();
  saveAllFamilies(families);
  
  // Create members
  const members = createExampleMembers(families);
  saveAllMembers(members);
  
  // Log creation events
  families.forEach(family => logFamilyCreated(family));
  members.forEach(member => logMemberCreated(member));
  
  // Mark as initialized
  setInitialized();
  
  console.log('Demo-Daten wurden initialisiert');
}

/**
 * Create example families
 */
function createExampleFamilies(): Family[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'family-mueller',
      name: 'Familie Müller',
      mainMemberId: 'member-mueller-hans',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'family-schmidt',
      name: 'Familie Schmidt',
      mainMemberId: 'member-schmidt-petra',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'family-weber',
      name: 'Familie Weber',
      mainMemberId: 'member-weber-thomas',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Create example members
 */
function createExampleMembers(families: Family[]): Member[] {
  const now = new Date().toISOString();
  
  return [
    // Familie Müller
    {
      id: 'member-mueller-hans',
      firstName: 'Hans',
      lastName: 'Müller',
      birthDate: '1975-03-15',
      street: 'Kanuweg 12',
      postalCode: '80331',
      city: 'München',
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      entryDate: '2018-04-01',
      isActive: true,
      familyId: 'family-mueller',
      isMainFamilyMember: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'member-mueller-maria',
      firstName: 'Maria',
      lastName: 'Müller',
      birthDate: '1978-07-22',
      street: 'Kanuweg 12',
      postalCode: '80331',
      city: 'München',
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      entryDate: '2018-04-01',
      isActive: true,
      familyId: 'family-mueller',
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'member-mueller-tim',
      firstName: 'Tim',
      lastName: 'Müller',
      birthDate: '2008-11-30',
      street: 'Kanuweg 12',
      postalCode: '80331',
      city: 'München',
      iban: 'DE89370400440532013000',
      bic: 'COBADEFFXXX',
      entryDate: '2020-05-15',
      isActive: true,
      familyId: 'family-mueller',
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
    
    // Familie Schmidt
    {
      id: 'member-schmidt-petra',
      firstName: 'Petra',
      lastName: 'Schmidt',
      birthDate: '1982-09-08',
      street: 'Flussstraße 45',
      postalCode: '80333',
      city: 'München',
      iban: 'DE91100000000123456789',
      bic: 'MARKDEF1100',
      entryDate: '2019-01-15',
      isActive: true,
      familyId: 'family-schmidt',
      isMainFamilyMember: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'member-schmidt-lukas',
      firstName: 'Lukas',
      lastName: 'Schmidt',
      birthDate: '2012-04-18',
      street: 'Flussstraße 45',
      postalCode: '80333',
      city: 'München',
      iban: 'DE91100000000123456789',
      bic: 'MARKDEF1100',
      entryDate: '2021-03-01',
      isActive: true,
      familyId: 'family-schmidt',
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
    
    // Familie Weber
    {
      id: 'member-weber-thomas',
      firstName: 'Thomas',
      lastName: 'Weber',
      birthDate: '1968-12-03',
      street: 'Seeweg 7',
      postalCode: '80335',
      city: 'München',
      iban: 'DE75512108001245126199',
      bic: 'SOLADEST600',
      entryDate: '2015-06-01',
      isActive: true,
      familyId: 'family-weber',
      isMainFamilyMember: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'member-weber-anna',
      firstName: 'Anna',
      lastName: 'Weber',
      birthDate: '1970-05-25',
      street: 'Seeweg 7',
      postalCode: '80335',
      city: 'München',
      iban: 'DE75512108001245126199',
      bic: 'SOLADEST600',
      entryDate: '2015-06-01',
      isActive: true,
      familyId: 'family-weber',
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
    
    // Einzelmitglieder (ohne Familie)
    {
      id: 'member-fischer-klaus',
      firstName: 'Klaus',
      lastName: 'Fischer',
      birthDate: '1990-02-14',
      street: 'Paddelgasse 23',
      postalCode: '80337',
      city: 'München',
      iban: 'DE68210501700012345678',
      bic: 'NOLADE21KIE',
      entryDate: '2022-08-01',
      isActive: true,
      familyId: undefined,
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'member-bauer-lisa',
      firstName: 'Lisa',
      lastName: 'Bauer',
      birthDate: '1995-06-30',
      street: 'Wasserweg 8',
      postalCode: '80339',
      city: 'München',
      iban: 'DE44500105175407324931',
      bic: 'INGDDEFFXXX',
      entryDate: '2023-01-01',
      isActive: true,
      familyId: undefined,
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
    
    // Inaktives Mitglied (ausgetreten)
    {
      id: 'member-hoffmann-michael',
      firstName: 'Michael',
      lastName: 'Hoffmann',
      birthDate: '1985-10-12',
      street: 'Alte Straße 99',
      postalCode: '80341',
      city: 'München',
      iban: 'DE89370400440532013001',
      bic: 'COBADEFFXXX',
      entryDate: '2017-03-01',
      exitDate: '2023-12-31',
      isActive: false,
      familyId: undefined,
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
    
    // Weiteres inaktives Mitglied
    {
      id: 'member-klein-sabine',
      firstName: 'Sabine',
      lastName: 'Klein',
      birthDate: '1972-08-05',
      street: 'Bergstraße 15',
      postalCode: '80343',
      city: 'München',
      iban: 'DE89370400440532013002',
      bic: 'COBADEFFXXX',
      entryDate: '2016-01-01',
      exitDate: '2022-06-30',
      isActive: false,
      familyId: undefined,
      isMainFamilyMember: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Reset all data and reinitialize with example data
 */
export function resetToExampleData(): void {
  // Clear the initialized flag to allow reinitialization
  localStorage.removeItem('kanu_initialized');
  localStorage.removeItem('kanu_members');
  localStorage.removeItem('kanu_families');
  localStorage.removeItem('kanu_audit_log');
  
  // Reinitialize
  initializeExampleData();
}
