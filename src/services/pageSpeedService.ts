import { LighthouseResult, PageSpeedInsightsResponse } from '@/types/lighthouse';

const API_KEY = 'YOUR_PAGESPEED_API_KEY'; // User will need to provide this
const BASE_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export class PageSpeedService {
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
  }

  static getApiKey(): string | null {
    return this.apiKey || localStorage.getItem('pagespeed_api_key');
  }

  static async testUrl(url: string, device: 'mobile' | 'desktop'): Promise<Partial<LighthouseResult>> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('PageSpeed Insights API key not provided');
    }

    try {
      // First, try to get the page title
      let name = url;
      try {
        const titleResponse = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (titleResponse.ok) {
          const data = await titleResponse.json();
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, 'text/html');
          const titleElement = doc.querySelector('title');
          if (titleElement) {
            name = titleElement.textContent || url;
          }
        }
      } catch (error) {
        console.log('Could not fetch page title, using URL');
      }

      const strategy = device === 'mobile' ? 'mobile' : 'desktop';
      const apiUrl = `${BASE_URL}?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PageSpeedInsightsResponse = await response.json();
      
      return {
        name,
        pageStatus: 200, // If we get here, the page loaded
        performance: Math.round((data.lighthouseResult.categories.performance?.score || 0) * 100),
        accessibility: Math.round((data.lighthouseResult.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((data.lighthouseResult.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((data.lighthouseResult.categories.seo?.score || 0) * 100),
        status: 'completed' as const
      };
    } catch (error) {
      console.error('Error testing URL:', error);
      return {
        name: url,
        pageStatus: 0,
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async testUrlWithFallback(url: string, device: 'mobile' | 'desktop'): Promise<Partial<LighthouseResult>> {
    // For demo purposes, we'll simulate API responses
    // In production, this would use the actual PageSpeed Insights API
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const isError = Math.random() < 0.1; // 10% chance of error for demo
        
        if (isError) {
          resolve({
            name: url,
            pageStatus: 404,
            performance: 0,
            accessibility: 0,
            bestPractices: 0,
            seo: 0,
            status: 'error',
            error: 'Site unreachable'
          });
        } else {
          resolve({
            name: `${url.replace(/https?:\/\//, '').split('/')[0]} - Demo Site`,
            pageStatus: 200,
            performance: Math.floor(Math.random() * 40) + 60, // 60-100
            accessibility: Math.floor(Math.random() * 30) + 70, // 70-100
            bestPractices: Math.floor(Math.random() * 50) + 50, // 50-100
            seo: Math.floor(Math.random() * 40) + 60, // 60-100
            status: 'completed'
          });
        }
      }, Math.random() * 2000 + 1000); // 1-3 second delay
    });
  }
}