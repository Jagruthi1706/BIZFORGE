// API Request Types
export interface BrandRequest {
  industry: string;
  keywords: string;
  tone: string;
  language: string;
  generateNames: boolean;
  generateTaglines: boolean;
  generateSlogans: boolean;
}

export interface LogoRequest {
  brandName: string;
  industry: string;
  keywords: string;
}

export interface ContentRequest {
  brandDescription: string;
  tone: string;
  contentType: 'product_desc' | 'ad_copy' | 'social_post' | 'email';
  language: string;
}

export interface DesignRequest {
  tone: string;
  industry: string;
}

export interface SentimentRequest {
  text: string;
}

// New Feature Request Types
export interface SocialRequest {
  brandName: string;
  industry: string;
  goal: string;
  platforms: string[];
  frequency: string;
}

export interface CompetitorRequest {
  competitorName: string;
  link: string;
}

export interface TrendRequest {
  industry: string;
  audience: string;
}

export interface RepurposeRequest {
  content: string;
}

export interface GrowthRequest {
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
}

export interface BrandSuiteRequest {
  industry: string;
  description: string;
  tone: string;
  keywords: string;
  includeNames: boolean;
  includeTaglines: boolean;
  includeLogos: boolean;
  includeStory: boolean;
  includeProductDesc: boolean;
  includeInvestorPitch: boolean;
}

// API Response Types
export interface BrandResponse {
  names?: Array<{ name: string; explanation: string }>;
  taglines?: string[];
  slogans?: string[];
}

export interface LogoResponse {
  imageUrl: string; // In a real app this might be base64 or a link
  prompt: string;
}

export interface ContentResponse {
  content: string;
}

export interface DesignResponse {
  palette: Array<{ hex: string; name: string }>;
  fonts: { primary: string; secondary: string };
  styleGuide: string;
}

export interface SentimentResponse {
  label: 'Positive' | 'Neutral' | 'Negative';
  confidence: number; // 0-1
  insights: string;
  rewrite: string;
}

// New Feature Response Types
export interface SocialResponse {
  calendar: Array<{ day: number; title: string; type: string }>;
  posts: Array<{ platform: string; content: string; hashtags: string[] }>;
}

export interface CompetitorResponse {
  frequency: string;
  engagement: string;
  gaps: string[];
  opportunities: string[];
  visualStyle: string;
}

export interface TrendResponse {
  topics: Array<{ topic: string; relevance: number; urgency: string }>;
  viralIdea: string;
}

export interface RepurposeResponse {
  tweets: string[];
  linkedin: string[];
  instagram: string;
  newsletter: string;
}

export interface GrowthResponse {
  platformMetrics: Array<{ platform: string; followers: number; engagement: string; growth: string }>;
  totalFollowers: number;
  forecast: Array<{ month: string; followers: number }>;
  contentRecommendations: string[];
}

export interface InvestorPitch {
  elevatorPitch: string;
  problem: string;
  solution: string;
  market: string;
  businessModel: string;
  competitiveAdvantage: string;
  traction: string;
  fundingAsk: string;
}

export interface BrandSuiteResponse {
  names?: Array<{ name: string; explanation: string }>;
  taglines?: string[];
  logos?: Array<{ url: string; prompt: string }>;
  brandStory?: string;
  productDescriptions?: Array<{ title: string; content: string }>;
  investorPitch?: InvestorPitch;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Application State Types
export type AppView = 'landing' | 'dashboard';
export type DashboardTab = 
  | 'brand' | 'logo' | 'content' | 'design' | 'sentiment' | 'chat'
  | 'social' | 'competitor' | 'trends' | 'repurpose' | 'growth' | 'startup_lab';

export interface GeneratedHistoryItem {
  type: DashboardTab;
  content: any;
  timestamp: number;
}