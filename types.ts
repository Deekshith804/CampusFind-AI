export enum ItemType {
  LOST = 'LOST',
  FOUND = 'FOUND'
}

export enum ItemStatus {
  OPEN = 'OPEN',
  RESOLVED = 'RESOLVED'
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  location: string;
  contactName: string;
  contactInfo: string;
  imageUrl?: string; // Base64 or URL
  tags: string[]; // AI generated tags
  aiDescription?: string; // AI generated detailed description
  date: string;
  status: ItemStatus;
}

export interface MatchResult {
  itemId: string;
  confidence: number; // 0-100
  reason: string;
}

export interface AIAnalysisResult {
  tags: string[];
  enhancedDescription: string;
  category: string;
}

export interface Notification {
  id: string;
  type: 'MATCH_FOUND';
  message: string;
  matches: MatchResult[];
  targetItemTitle: string;
}