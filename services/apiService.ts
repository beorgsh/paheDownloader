
import { AnimeSearchResult, EpisodeResponse, DownloadResponse } from '../types';

const BASE_URL = 'https://anime.apex-cloud.workers.dev/';

export const searchAnime = async (query: string): Promise<AnimeSearchResult[]> => {
  try {
    const response = await fetch(`${BASE_URL}?method=search&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    
    return Array.isArray(data) ? data : (data.results || []);
  } catch (error) {
    console.error('Error fetching anime:', error);
    return [];
  }
};

export const getEpisodes = async (session: string, page: number = 1): Promise<EpisodeResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}?method=series&session=${session}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch episodes');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return null;
  }
};

export const getDownloadLinks = async (animeSession: string, episodeSession: string): Promise<DownloadResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}?method=episode&session=${animeSession}&ep=${episodeSession}`);
    if (!response.ok) throw new Error('Failed to fetch download links');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching download links:', error);
    return null;
  }
};
