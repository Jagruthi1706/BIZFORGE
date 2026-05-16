import { 
  BrandRequest, BrandResponse, 
  LogoRequest, LogoResponse, 
  ContentRequest, ContentResponse, 
  DesignRequest, DesignResponse, 
  SentimentRequest, SentimentResponse,
  SocialRequest, SocialResponse,
  CompetitorRequest, CompetitorResponse,
  TrendRequest, TrendResponse,
  RepurposeRequest, RepurposeResponse,
  GrowthRequest, GrowthResponse,
  BrandSuiteRequest, BrandSuiteResponse
} from '../types';
import { BackendApi, isBackendConfigured } from './backendApi';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const useLiveApi = () => isBackendConfigured();

export const ApiService = {
  async generateBrand(data: BrandRequest): Promise<BrandResponse> {
    if (useLiveApi()) return BackendApi.generateBrand(data);
    await delay(1500);
    const result: BrandResponse = {};

    if (data.generateNames) {
      const prefixes = ['Nova', 'Syn', 'Aero', 'Lumi', 'Velox', 'Strat', 'Core', 'Zen', 'Nex', 'Vivi'];
      const suffixes = ['Flow', 'Forge', 'Mind', 'Sphere', 'Gen', 'Sys', 'Pulse', 'Wave', 'Edge', 'Hub'];
      
      result.names = Array.from({ length: 8 }, (_, i) => {
        const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        return {
          name,
          explanation: `A modern, ${data.tone} name suitable for the ${data.industry} industry.`
        };
      });
    }

    if (data.generateTaglines) {
      result.taglines = [
        `The future of ${data.industry}.`,
        `${data.industry} reimagined.`,
        `Simply better ${data.industry}.`,
        `Innovation that moves you.`,
        `Your partner in ${data.industry}.`
      ];
    }

    if (data.generateSlogans) {
      result.slogans = [
        `Think smarter. Live better.`,
        `Built for the bold.`,
        `Excellence in every detail.`,
        `Powering your potential.`,
        `Beyond boundaries.`
      ];
    }

    return result;
  },

  async generateLogo(data: LogoRequest): Promise<LogoResponse> {
    if (useLiveApi()) return BackendApi.generateLogo(data);
    await delay(3000); // Image gen takes longer
    return {
      // Using picsum to simulate a generated image
      imageUrl: `https://picsum.photos/seed/${data.brandName + Date.now()}/512/512`,
      prompt: `Minimalist vector logo for ${data.brandName}, ${data.industry} industry, ${data.keywords} style, flat design, high contrast, professional vector art.`
    };
  },

  async generateContent(data: ContentRequest): Promise<ContentResponse> {
    if (useLiveApi()) return BackendApi.generateContent(data);
    await delay(2000);
    let content = "";
    
    if (data.contentType === 'product_desc') {
      content = `Introducing the future of ${data.brandDescription}. Our new line is meticulously crafted to deliver unparalleled performance. With a ${data.tone} approach, we redefine what's possible. Experience excellence today.`;
    } else if (data.contentType === 'email') {
      content = `Subject: Revolutionize your workflow with us\n\nDear Customer,\n\nAre you ready to experience ${data.brandDescription}? We are thrilled to announce our latest offering. It's time to embrace a ${data.tone} future.\n\nBest,\nThe Team`;
    } else {
      content = `✨ Discover ${data.brandDescription}! ✨\n\nUnleash the power of innovation. #Innovation #${data.tone} #Future`;
    }

    if (data.language !== 'en') {
      content = `[Translated to ${data.language}]: ${content}`;
    }

    return { content };
  },

  async getColors(data: DesignRequest): Promise<DesignResponse> {
    if (useLiveApi()) return BackendApi.getColors(data);
    await delay(1000);
    // Determine palette based on tone roughly
    const isBold = data.tone.toLowerCase().includes('bold');
    const isElegant = data.tone.toLowerCase().includes('elegant');
    
    let palette;
    if (isBold) {
      palette = [
        { hex: '#FF5733', name: 'Vibrant Orange' },
        { hex: '#C70039', name: 'Crimson Red' },
        { hex: '#900C3F', name: 'Deep Burgundy' },
        { hex: '#581845', name: 'Dark Plum' },
      ];
    } else if (isElegant) {
      palette = [
        { hex: '#F0E68C', name: 'Khaki' },
        { hex: '#BDB76B', name: 'Dark Khaki' },
        { hex: '#556B2F', name: 'Dark Olive' },
        { hex: '#2F4F4F', name: 'Dark Slate' },
      ];
    } else {
      // Default Tech/Blue
      palette = [
        { hex: '#0ea5e9', name: 'Sky Blue' },
        { hex: '#0284c7', name: 'Ocean Blue' },
        { hex: '#0f172a', name: 'Midnight Navy' },
        { hex: '#f8fafc', name: 'Cloud White' },
      ];
    }

    return {
      palette,
      fonts: { primary: 'Inter', secondary: 'Poppins' },
      styleGuide: `Use ${palette[0].name} for primary CTAs. ${palette[2].name} provides a solid background for headers. Keep typography clean with Inter for body text.`
    };
  },

  async analyzeSentiment(data: SentimentRequest): Promise<SentimentResponse> {
    if (useLiveApi()) return BackendApi.analyzeSentiment(data);
    await delay(1200);
    const textLower = data.text.toLowerCase();
    const isNegative = textLower.includes('bad') || textLower.includes('terrible') || textLower.includes('slow');
    const isPositive = textLower.includes('good') || textLower.includes('great') || textLower.includes('excellent');
    
    return {
      label: isPositive ? 'Positive' : (isNegative ? 'Negative' : 'Neutral'),
      confidence: 0.89,
      insights: isNegative ? 'The customer seems frustrated with performance.' : 'The tone is generally appreciative but could use more excitement.',
      rewrite: `Rewritten: ${data.text} (Polished for a Professional tone)`
    };
  },

  async chat(message: string): Promise<string> {
    if (useLiveApi()) return BackendApi.chat(message);
    await delay(1000);
    return `As your BizForge Branding Assistant, I suggest focusing on consistency. Regarding "${message}", consider how it aligns with your core values. Can I help you generate a logo or tagline for this?`;
  },

  // --- New Feature Mocks ---

  async generateSocialMedia(data: SocialRequest): Promise<SocialResponse> {
    if (useLiveApi()) return BackendApi.generateSocialMedia(data);
    await delay(2500);
    return {
      calendar: [
        { day: 1, title: 'Product Teaser', type: 'Video' },
        { day: 3, title: 'Customer Testimonial', type: 'Image' },
        { day: 5, title: 'Behind the Scenes', type: 'Story' },
        { day: 7, title: 'Industry Tip', type: 'Carousel' },
      ],
      posts: [
        { platform: 'Instagram', content: `🚀 Big things coming! We are changing the game in ${data.industry}. Stay tuned! #${data.industry} #Launch`, hashtags: ['#innovation', '#tech', '#growth'] },
        { platform: 'LinkedIn', content: `We are proud to announce our latest initiative in the ${data.industry} sector. Our goal is ${data.goal}.`, hashtags: ['#Business', '#Leadership'] },
        { platform: 'Twitter', content: `Ready to level up your ${data.industry} game? We've got you covered. 🚀`, hashtags: ['#Startup'] },
      ]
    };
  },

  async scanCompetitor(data: CompetitorRequest): Promise<CompetitorResponse> {
    if (useLiveApi()) return BackendApi.scanCompetitor(data);
    await delay(2000);
    return {
      frequency: 'Daily',
      engagement: 'High (Avg 500 likes/post)',
      gaps: ['Lack of video content', 'Inconsistent posting times'],
      opportunities: ['Use more Reels/Shorts', 'Engage in comments more'],
      visualStyle: 'Minimalist, Blue & White theme'
    };
  },

  async predictTrends(data: TrendRequest): Promise<TrendResponse> {
    if (useLiveApi()) return BackendApi.predictTrends(data);
    await delay(1800);
    return {
      topics: [
        { topic: 'AI Automation', relevance: 95, urgency: 'High' },
        { topic: 'Sustainability', relevance: 80, urgency: 'Medium' },
        { topic: 'Remote Work Tools', relevance: 70, urgency: 'Low' },
      ],
      viralIdea: `Create a "Day in the Life" video showing how your product automates ${data.industry} tasks.`
    };
  },

  async repurposeContent(data: RepurposeRequest): Promise<RepurposeResponse> {
    if (useLiveApi()) return BackendApi.repurposeContent(data);
    await delay(2000);
    return {
      tweets: [
        'Did you know? [Key Point 1] 🤯',
        '3 ways to improve: 1. [Point 1] 2. [Point 2] 3. [Point 3]',
        'Unpopular opinion: [Controversial take based on text]',
        'Thread: Here is how to master [Topic] 👇',
        'Just posted about [Topic]. Check it out!'
      ],
      linkedin: [
        'I recently explored [Topic] and found some interesting insights...',
        'The state of [Industry] is changing. Here is my take...',
        'efficiency hack: [Key takeaway from text]. Thoughts?'
      ],
      instagram: 'Visualizing [Topic] today! 📸 Swipe to see how it works.',
      newsletter: 'Hi there,\n\nThis week we dive deep into [Topic]. Here is what you need to know...'
    };
  },

  async simulateGrowth(data: GrowthRequest): Promise<GrowthResponse> {
    if (useLiveApi()) return BackendApi.simulateGrowth(data);
    await delay(1500);
    const metrics = [];
    let totalFollowers = 0;

    if (data.instagramUrl) {
      metrics.push({ platform: 'Instagram', followers: 15400, engagement: '4.8%', growth: '+12%' });
      totalFollowers += 15400;
    }
    if (data.linkedinUrl) {
      metrics.push({ platform: 'LinkedIn', followers: 5200, engagement: '2.1%', growth: '+5%' });
      totalFollowers += 5200;
    }
    if (data.twitterUrl) {
      metrics.push({ platform: 'Twitter', followers: 8900, engagement: '1.5%', growth: '+3%' });
      totalFollowers += 8900;
    }
    if (data.facebookUrl) {
      metrics.push({ platform: 'Facebook', followers: 3100, engagement: '3.2%', growth: '+1%' });
      totalFollowers += 3100;
    }
    if (data.youtubeUrl) {
      metrics.push({ platform: 'YouTube', followers: 12000, engagement: '6.5%', growth: '+15%' });
      totalFollowers += 12000;
    }
    
    // Default mock if empty
    if (metrics.length === 0) {
      metrics.push({ platform: 'Combined', followers: 0, engagement: '0%', growth: '0%' });
    }

    return {
      platformMetrics: metrics,
      totalFollowers,
      forecast: [
        { month: 'Month 1', followers: Math.floor(totalFollowers * 1.05) },
        { month: 'Month 2', followers: Math.floor(totalFollowers * 1.12) },
        { month: 'Month 3', followers: Math.floor(totalFollowers * 1.20) },
        { month: 'Month 4', followers: Math.floor(totalFollowers * 1.35) },
      ],
      contentRecommendations: [
        "Increase posting frequency on Instagram Reels to boost reach.",
        "Your LinkedIn engagement is high; focus on more thought leadership articles.",
        "YouTube shorts are driving the most growth, double down on short-form video."
      ]
    };
  },

  async generateBrandSuite(data: BrandSuiteRequest): Promise<BrandSuiteResponse> {
    if (useLiveApi()) return BackendApi.generateBrandSuite(data);
    await delay(4000); // Orchestrator takes longer as it calls multiple services
    const response: BrandSuiteResponse = {};

    const seed = Date.now();

    if (data.includeNames) {
      const prefixes = ['Aura', 'Novus', 'Zent', 'Lumina', 'Velo', 'Core', 'Strat', 'Nexo'];
      const suffixes = ['Flow', 'Forge', 'Mind', 'Sys', 'Pulse', 'Edge', 'Hub', 'Lab'];
      response.names = Array.from({ length: 5 }, () => {
        const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
        return {
          name,
          explanation: `A strategic ${data.tone} name tailored for the ${data.industry} market.`
        };
      });
    }

    if (data.includeTaglines) {
      response.taglines = [
        `Redefining ${data.industry} for everyone.`,
        `The ${data.tone} choice for the future.`,
        `Innovation meets ${data.industry}.`,
        `Your vision, our technology.`
      ];
    }

    if (data.includeLogos) {
      response.logos = [
        { 
          url: `https://picsum.photos/seed/${seed}/512/512`, 
          prompt: `Minimalist modern logo for a ${data.industry} company, ${data.tone} style, vector graphics, flat design.` 
        },
        { 
          url: `https://picsum.photos/seed/${seed+1}/512/512`, 
          prompt: `Abstract geometric symbol representing ${data.industry}, gradient colors, futuristic tech style.` 
        }
      ];
    }

    if (data.includeStory) {
      response.brandStory = `Founded on the principle that ${data.industry} should be accessible to all, we are a team of visionaries dedicated to pushing boundaries. Our journey began with a simple idea: to make the world more ${data.tone}. Today, we stand at the forefront of innovation, driven by our commitment to excellence and our passion for serving our community. We believe in building a future where technology serves humanity, not the other way around.`;
    }

    if (data.includeProductDesc) {
      response.productDescriptions = [
        {
          title: 'Flagship Offering',
          content: `Our premium solution designed for the modern ${data.industry} professional. Experience unmatched efficiency and a ${data.tone} workflow that adapts to your needs.`
        },
        {
          title: 'Enterprise Suite',
          content: `Scalable, secure, and robust. Our enterprise package delivers the power you need to dominate the ${data.industry} market.`
        }
      ];
    }
    
    if (data.includeInvestorPitch) {
      response.investorPitch = {
        elevatorPitch: `We are revolutionizing the ${data.industry} landscape by combining advanced ${data.keywords} with intuitive design, solving the core inefficiencies faced by market leaders.`,
        problem: `Currently, the ${data.industry} sector suffers from fragmented solutions and high operational costs. Competitors offer outdated, complex tools that slow down growth.`,
        solution: `Our platform delivers an all-in-one, AI-driven ecosystem that streamlines operations. We provide ${data.tone} tools that empower users to achieve more with less effort.`,
        market: `The global ${data.industry} market is valued at $50B+ and growing at 12% CAGR. We are targeting the underserved mid-market segment, representing a $10B opportunity.`,
        businessModel: `We operate on a SaaS subscription model with tiered pricing (Pro/Enterprise). Additional revenue streams include API licensing and premium consultancy add-ons.`,
        competitiveAdvantage: `Unlike traditional players, our proprietary AI models are trained specifically on ${data.industry} datasets, offering 3x faster processing and higher accuracy.`,
        traction: `In just 6 months, we've secured 5 pilot partners, generated $10k in MRR, and built a waitlist of 500+ potential users.`,
        fundingAsk: `We are seeking $2M in Seed funding to accelerate product development, expand our engineering team, and capture 5% market share in the next 18 months.`
      };
    }

    return response;
  }
};