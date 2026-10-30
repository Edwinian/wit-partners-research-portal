export type Publicity = "public" | "internal" | "licensed";
export type ContentType =
  | "newsletter"
  | "pdf_report"
  | "fund_letter"
  | "transcript"
  | "analyst_note";
export type Role = "investment_manager" | "platform_operator";

export interface User {
  id: string;
  email: string;
  password: string;
  display_name: string;
  role: Role;
  credibility_threshold: number;
  likes: string[];
}

export interface Research {
  id: string;
  title: string;
  theme: string | null;
  asset_class: string | null;
  geography: string | null;
  time_horizon: string | null;
  confidence: number | null;
  credibility: number;
  contentType: ContentType;
  publicity: Publicity;
  attachment: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const CREDIBILITY_MIN = 1;
export const CREDIBILITY_MAX = 10;
export const CREDIBILITY_THRESHOLD_MIN = 2;
export const MARKET_OVERVIEW_CREDIBILITY_THRESHOLD = 1;

export interface MarketOverview {
  id: string;
  content: string;
  credibility: number;
  latestResearchAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface DemoState {
  users: User[];
  researches: Research[];
  overviews: MarketOverview[];
  threads: Thread[];
}

export const CONTENT_PAGES: {
  path: string;
  label: string;
  contentType: ContentType;
}[] = [
  { path: "/newsletters", label: "Newsletters", contentType: "newsletter" },
  { path: "/pdf-reports", label: "PDF Reports", contentType: "pdf_report" },
  { path: "/fund-letters", label: "Fund Letters", contentType: "fund_letter" },
  { path: "/call-transcripts", label: "Call Transcripts", contentType: "transcript" },
  { path: "/analyst-notes", label: "Analyst Notes", contentType: "analyst_note" },
];
