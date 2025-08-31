export interface SettingsData {
  theme: 'light'; // Always light theme
  autoSave: boolean;
  autoSaveInterval: number;
  defaultCategory: string;
  exportFormat: string;
  showLineNumbers: boolean;
  fontSize: number;
  fontFamily: string;
  wordWrap: boolean;
  lineHeight: number;
  tabSize: number;
  bracketMatching: boolean;
  highlightActiveLine: boolean;
  showInvisibles: boolean;
  copyableCommand: string; // The command that appears in the copyable field
}
