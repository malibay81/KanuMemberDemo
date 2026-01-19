**PROMPT:**

Erstelle eine moderne, responsive Demo-Web-App zur Mitgliederverwaltung eines Kanuvereins mit **React + TypeScript**.

**Technische Vorgaben**

* React (funktionale Komponenten)
* TypeScript strikt
* Moderne UI (z. B. Tailwind oder vergleichbar, klare Cards, Dialoge, Tabellen)
* Mobile-first, vollständig responsive
* Kein Backend – **LocalStorage als alleinige Persistenz**
* Saubere Projektstruktur (components, hooks, services, models)

**Kernfunktionen**

1. **Mitgliederverwaltung**
   * Mitglieder anlegen, bearbeiten
   * Mitglieder **nicht löschen**, sondern **aktiv / deaktiviert**
   * Status visuell klar erkennbar
2. **Mitgliedsdaten**
   * Persönliche Daten (Name, Geburtsdatum)
   * Adresse (Straße, PLZ, Ort)
   * Bankdaten (IBAN, BIC – Demo, keine Validierung notwendig)
   * Eintrittsdatum
   * Austrittsdatum (optional)
3. **Familienverknüpfung**
   * Mitglieder können zu Familiengruppen verknüpft werden
   * Ein Mitglied kann Hauptmitglied einer Familie sein
   * Grundlage für spätere Rabattlogik (Rabatte selbst nur vorbereiten, nicht berechnen)
4. **Historie / Audit-Log**
   * Jede relevante Aktion wird geloggt:
     * Erstellung
     * Änderungen
     * Aktivieren / Deaktivieren
     * Familienverknüpfungen
   * Log enthält: Zeitstempel, Aktion, betroffene Mitglied-ID
5. **CSV Import / Export**
   * Export aller Mitglieder inkl. Status und Familien-IDs als CSV
   * Import aus CSV mit Validierung
   * Bestehende Mitglieder anhand einer ID aktualisieren

**UI / UX**
* Übersichtsseite mit filterbarer Mitgliederliste
* Deutliche Statusanzeige (aktiv / inaktiv)
* Detailansicht oder Modal zum Bearbeiten
* Aktionen klar getrennt (Bearbeiten ≠ Deaktivieren)

**Datenmodell**
* Eindeutige UUID pro Mitglied
* Familien-ID als Referenz
* Alle Daten und Logs werden im LocalStorage gespeichert

**Lieferumfang**
* Vollständiger React + TypeScript Code
* Beispiel-Daten zum Initialisieren
* Klare Kommentare, damit die App leicht auf ein echtes Backend migriert werden kann

Ziel ist eine **realistische, saubere Demo-App**, keine Spielerei.