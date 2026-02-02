
export interface AnimeSearchResult {
  id: number;
  title: string;
  type: string;
  episodes: number;
  status: string;
  season: string;
  year: number;
  score: number;
  poster: string;
  session: string;
}

export interface AnimeDetail {
  title: string;
  image: string;
  description?: string;
  genres?: string[];
  episodes?: Episode[];
}

export interface Episode {
  episode: string;
  session: string;
  snapshot: string;
}

export interface EpisodeResponse {
  title: string;
  total: number;
  page: number;
  total_pages: number;
  next: boolean | string;
  episodes: Episode[];
}

export interface DownloadItem {
  link: string;
  name: string;
}

export type DownloadResponse = DownloadItem[];

export interface GeminiAnalysis {
  summary: string;
  whyWatch: string;
  rating: string;
}
