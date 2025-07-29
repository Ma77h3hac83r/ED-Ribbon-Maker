// Elite Dangerous Commander Types
export interface Commander {
  id: string;
  name: string;
  inaraId: string;
  rankCombat: number;
  rankTrade: number;
  rankExplorer: number;
  rankExobiologist: number;
  rankMercenary: number;
  rankFederal: number;
  rankImperial: number;
}

// Ribbon Types
export interface Ribbon {
  id: string;
  type: 'combat' | 'explorer' | 'trader' | 'exobiologist' | 'mercenary' | 'federal' | 'imperial';
  level: number;
  name: string;
  description: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  commanderId?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  ribbonLayout: RibbonLayout;
  displayOptions: DisplayOptions;
}

export interface RibbonLayout {
  arrangement: 'horizontal' | 'vertical' | 'grid';
  spacing: number;
  showLabels: boolean;
}

export interface DisplayOptions {
  theme: 'light' | 'dark' | 'auto';
  showRibbonNames: boolean;
  showRibbonDescriptions: boolean;
}