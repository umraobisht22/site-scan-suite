export interface LighthouseResult {
  id: string;
  url: string;
  name: string;
  pageStatus: number;
  device: 'mobile' | 'desktop';
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  status: 'pending' | 'testing' | 'completed' | 'error';
  error?: string;
}

export interface PageSpeedInsightsResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    fetchTime: string;
  };
  id: string;
}

export interface ProcessingStats {
  total: number;
  completed: number;
  errors: number;
  currentUrl: string;
}