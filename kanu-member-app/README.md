# Kanu-Verein Mitgliederverwaltung

Eine moderne, responsive Demo-Web-App zur Mitgliederverwaltung eines Kanuvereins, entwickelt mit **React + TypeScript**.

## 🚀 Features

### Mitgliederverwaltung
- Mitglieder anlegen und bearbeiten
- Mitglieder werden nicht gelöscht, sondern **aktiviert/deaktiviert**
- Status visuell klar erkennbar (grün = aktiv, rot = inaktiv)
- Filterfunktion nach Name, Ort, Status und Familie

### Mitgliedsdaten
- Persönliche Daten (Name, Geburtsdatum)
- Adresse (Straße, PLZ, Ort)
- Bankdaten (IBAN, BIC - Demo, keine Validierung)
- Eintrittsdatum
- Austrittsdatum (optional)

### Familienverknüpfung
- Mitglieder können zu Familiengruppen verknüpft werden
- Ein Mitglied kann Hauptmitglied einer Familie sein
- Grundlage für spätere Rabattlogik (vorbereitet, nicht implementiert)

### Historie / Audit-Log
Jede relevante Aktion wird geloggt:
- Erstellung von Mitgliedern
- Änderungen an Mitgliedsdaten
- Aktivieren / Deaktivieren
- Familienverknüpfungen
- Import/Export-Aktionen

### CSV Import / Export
- Export aller Mitglieder inkl. Status und Familien-IDs als CSV
- Import aus CSV mit Validierung
- Bestehende Mitglieder werden anhand der ID aktualisiert

## 🛠️ Technologie-Stack

- **React** (funktionale Komponenten mit Hooks)
- **TypeScript** (strikt typisiert)
- **Tailwind CSS** (moderne, responsive UI)
- **Vite** (schneller Build-Prozess)
- **LocalStorage** (Persistenz ohne Backend)
- **UUID** (eindeutige Identifikatoren)

## 📁 Projektstruktur

```
src/
├── components/
│   ├── ui/              # Wiederverwendbare UI-Komponenten
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── members/         # Mitglieder-Komponenten
│   │   ├── MemberList.tsx
│   │   ├── MemberForm.tsx
│   │   ├── MemberDetails.tsx
│   │   ├── MemberFilter.tsx
│   │   └── CSVImportExport.tsx
│   ├── families/        # Familien-Komponenten
│   │   └── FamilyManager.tsx
│   └── audit/           # Audit-Log-Komponenten
│       └── AuditLogViewer.tsx
├── hooks/               # Custom React Hooks
│   ├── useMembers.ts
│   └── useFamilies.ts
├── services/            # Business Logic & Datenzugriff
│   ├── storageService.ts    # LocalStorage-Zugriff
│   ├── memberService.ts     # Mitglieder-Logik
│   ├── auditService.ts      # Audit-Log-Logik
│   ├── csvService.ts        # CSV Import/Export
│   └── initService.ts       # Demo-Daten-Initialisierung
├── models/              # TypeScript Interfaces
│   └── types.ts
└── App.tsx              # Hauptkomponente
```

## 🚀 Installation & Start

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build
```

## 📊 Demo-Daten

Die App wird beim ersten Start automatisch mit Beispieldaten initialisiert:
- 11 Mitglieder (9 aktiv, 2 inaktiv)
- 3 Familien (Müller, Schmidt, Weber)
- Vollständige Audit-Historie

Die Demo-Daten können über die Einstellungen zurückgesetzt werden.

## 🔄 Migration zu einem Backend

Die App ist so strukturiert, dass sie leicht auf ein echtes Backend migriert werden kann:

1. **Services austauschen**: Die `storageService.ts` kann durch API-Aufrufe ersetzt werden
2. **Typen beibehalten**: Alle TypeScript-Interfaces in `models/types.ts` können wiederverwendet werden
3. **Hooks anpassen**: Die Custom Hooks können um API-Calls erweitert werden

### Beispiel für Backend-Migration:

```typescript
// Vorher (LocalStorage)
export function getAllMembers(): Member[] {
  return getFromStorage<Member[]>(STORAGE_KEYS.MEMBERS, []);
}

// Nachher (API)
export async function getAllMembers(): Promise<Member[]> {
  const response = await fetch('/api/members');
  return response.json();
}
```

## 📝 CSV-Format

Das CSV verwendet Semikolon (;) als Trennzeichen:

```csv
id;firstName;lastName;birthDate;street;postalCode;city;iban;bic;entryDate;exitDate;isActive;familyId;isMainFamilyMember
```

- Datumsformat: `YYYY-MM-DD`
- Boolean-Werte: `true` / `false`

## 🎨 UI/UX Features

- **Mobile-first Design**: Vollständig responsive
- **Klare Statusanzeige**: Farbcodierte Badges für aktiv/inaktiv
- **Intuitive Navigation**: Tab-basierte Struktur
- **Modale Dialoge**: Für Bearbeitung und Details
- **Filterbare Listen**: Schnelle Suche und Filterung

## 🌐 Deployment auf GitHub Pages

### Automatisches Deployment (empfohlen)

1. **Repository auf GitHub erstellen**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/kanu-member-app.git
   git push -u origin main
   ```

2. **GitHub Pages aktivieren**
   - Gehe zu deinem Repository auf GitHub
   - Klicke auf **Settings** → **Pages**
   - Unter **Source** wähle **GitHub Actions**

3. **Base-Path anpassen** (falls nötig)
   
   In [`vite.config.ts`](vite.config.ts) den `base`-Pfad an deinen Repository-Namen anpassen:
   ```typescript
   base: '/dein-repository-name/',
   ```

4. **Push und Deployment**
   
   Bei jedem Push auf den `main` Branch wird die App automatisch deployed.
   Die App ist dann erreichbar unter:
   ```
   https://DEIN-USERNAME.github.io/kanu-member-app/
   ```

### Manuelles Deployment

```bash
# Build erstellen
npm run build

# Den Inhalt des 'dist' Ordners auf GitHub Pages hochladen
```

### Wichtige Hinweise

- Der `base`-Pfad in `vite.config.ts` muss mit dem Repository-Namen übereinstimmen
- GitHub Actions Workflow ist bereits konfiguriert (`.github/workflows/deploy.yml`)
- LocalStorage funktioniert auch auf GitHub Pages

## 📄 Lizenz

Demo-Anwendung für Demonstrationszwecke.
