/**
 * Typed HTTP client for the BizForge FastAPI backend.
 * Set `VITE_API_BASE_URL` (e.g. http://127.0.0.1:8000) to use the real API instead of mocks.
 */

import type {
  BrandRequest,
  BrandResponse,
  BrandSuiteRequest,
  BrandSuiteResponse,
  CompetitorRequest,
  CompetitorResponse,
  ContentRequest,
  ContentResponse,
  DesignRequest,
  DesignResponse,
  GrowthRequest,
  GrowthResponse,
  LogoRequest,
  LogoResponse,
  RepurposeRequest,
  RepurposeResponse,
  SentimentRequest,
  SentimentResponse,
  SocialRequest,
  SocialResponse,
  TrendRequest,
  TrendResponse,
} from '../types';

function baseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (raw ?? '').replace(/\/$/, '');
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const root = baseUrl();
  if (!root) {
    throw new Error('VITE_API_BASE_URL is not set');
  }
  const res = await fetch(`${root}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

export const BackendApi = {
  async generateBrand(data: BrandRequest): Promise<BrandResponse> {
    return postJson('/brand/generate', data);
  },

  async generateLogo(data: LogoRequest): Promise<LogoResponse> {
    return postJson('/logo/generate', data);
  },

  async generateContent(data: ContentRequest): Promise<ContentResponse> {
    return postJson('/content/generate', {
      brandDesc: data.brandDescription,
      contentType: data.contentType,
      tone: data.tone,
    });
  },

  async getColors(data: DesignRequest): Promise<DesignResponse> {
    return postJson('/design/generate', data);
  },

  async analyzeSentiment(data: SentimentRequest): Promise<SentimentResponse> {
    return postJson('/sentiment/analyze', {
      reviewText: data.text,
    });
  },

  async generateSocialMedia(data: SocialRequest): Promise<SocialResponse> {
    return postJson('/social/plan', data);
  },

  async scanCompetitor(data: CompetitorRequest): Promise<CompetitorResponse> {
    return postJson('/competitor/scan', data);
  },

  async predictTrends(data: TrendRequest): Promise<TrendResponse> {
    return postJson('/trends/predict', {
      industry: data.industry,
      targetAudience: data.audience,
    });
  },

  async repurposeContent(data: RepurposeRequest): Promise<RepurposeResponse> {
    return postJson('/repurpose/generate', {
      marketingText: data.content,
    });
  },

  async simulateGrowth(data: GrowthRequest): Promise<GrowthResponse> {
    return postJson('/growth/analyze', data);
  },

  async generateBrandSuite(data: BrandSuiteRequest): Promise<BrandSuiteResponse> {
    return postJson('/suite/generate', data);
  },

  async chat(message: string): Promise<string> {
    const j = await postJson<{ reply: string }>('/chat/message', { message });
    return j.reply ?? '';
  },
};

export function isBackendConfigured(): boolean {
  return baseUrl().length > 0;
}
