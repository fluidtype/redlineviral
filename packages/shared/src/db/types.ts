export type Profile = {
  id: string;
  email: string;
  niche: string[];
  region: string | null;
  created_at: string;
};

export type Video = {
  id: string;
  user_id: string;
  r2_key: string;
  url: string;
  duration_s: number;
  has_audio: boolean;
  created_at: string;
};

export type Analysis = {
  id: string;
  video_id: string;
  status: string;
  started_at: string;
  finished_at?: string | null;
  error_code?: string | null;
  parent_analysis_id?: string | null;
};

export type AnalysisResult = {
  id: string;
  analysis_id: string;
  radar: unknown;
  scores: unknown;
  warnings: unknown;
  recommendations: unknown;
};

export type TrendCache = {
  id: number;
  platform: string;
  region: string;
  hours: number;
  query: string | null;
  payload: unknown;
  cached_at: string;
};

export type Kit = {
  id: string;
  analysis_id: string;
  version: number;
  title: string;
  caption: string;
  hashtags: string[];
  music_keywords: string[];
  best_time: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  payload: unknown;
  read_at?: string | null;
  created_at: string;
};
