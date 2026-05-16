import React, { useState, useEffect, useRef } from 'react';
import { ApiService } from '../services/mockApi';
import { 
  AppView, DashboardTab, 
  BrandResponse, LogoResponse, ContentResponse, DesignResponse, SentimentResponse, ChatMessage,
  SocialResponse, CompetitorResponse, TrendResponse, RepurposeResponse, GrowthResponse, BrandSuiteResponse
} from '../types';
import { Button, Input, Select, Textarea, Card, VoiceInput, Skeleton, Badge, ImageModal, ProgressBar, Tabs } from '../components/ui/Elements';
import { 
  LayoutDashboard, PenTool, Image as ImageIcon, FileText, Palette, MessageSquare, 
  Download, Copy, RefreshCw, ChevronLeft, Send, Sparkles, Languages,
  ChevronRight, PanelLeftClose, PanelLeftOpen, CheckCircle, Heart, Share2, Maximize2, Monitor,
  Fingerprint, Share, Search, Scale, TrendingUp, Repeat, Radar, BarChart2, Rocket, Package,
  Presentation, FileCheck, Briefcase
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('brand');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  
  // Existing Results State
  const [brandResult, setBrandResult] = useState<BrandResponse | null>(null);
  const [logoResult, setLogoResult] = useState<LogoResponse | null>(null);
  const [contentResult, setContentResult] = useState<ContentResponse | null>(null);
  const [designResult, setDesignResult] = useState<DesignResponse | null>(null);
  const [sentimentResult, setSentimentResult] = useState<SentimentResponse | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'init', role: 'assistant', content: 'Hello! I am your BizForge AI branding assistant using IBM Granite. How can I help you build your brand today?', timestamp: Date.now() }
  ]);

  // New Features State
  const [socialResult, setSocialResult] = useState<SocialResponse | null>(null);
  const [competitorResult, setCompetitorResult] = useState<CompetitorResponse | null>(null);
  const [trendResult, setTrendResult] = useState<TrendResponse | null>(null);
  const [repurposeResult, setRepurposeResult] = useState<RepurposeResponse | null>(null);
  const [growthResult, setGrowthResult] = useState<GrowthResponse | null>(null);
  const [brandSuiteResult, setBrandSuiteResult] = useState<BrandSuiteResponse | null>(null);

  const [activeSocialTab, setActiveSocialTab] = useState('Instagram');

  // Saved Items Mock
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Inputs State
  const [formData, setFormData] = useState({
    industry: '',
    keywords: '',
    tone: 'Professional',
    language: 'en',
    brandName: '',
    brandDesc: '',
    contentType: 'social_post',
    reviewText: '',
    chatMessage: '',
    // New inputs
    campaignGoal: '',
    platforms: ['Instagram', 'LinkedIn', 'Twitter'],
    postFrequency: 'Daily',
    competitorName: '',
    competitorLink: '',
    marketingText: '',
    targetAudience: '',
    // Brand Config
    generateNames: true,
    generateTaglines: false,
    generateSlogans: false,
    // Social Growth Inputs
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
    // Brand Suite Config
    suiteDescription: '',
    includeSuiteNames: true,
    includeSuiteTaglines: true,
    includeSuiteLogos: true,
    includeSuiteStory: true,
    includeSuiteProduct: false,
    includeSuitePitch: false
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Voice Input Logic
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = formData.language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceTranscript(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [activeTab, formData.language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    if (activeTab === 'brand') setFormData(p => ({ ...p, keywords: p.keywords + ' ' + text }));
    else if (activeTab === 'logo') setFormData(p => ({ ...p, keywords: p.keywords + ' ' + text }));
    else if (activeTab === 'content') setFormData(p => ({ ...p, brandDesc: p.brandDesc + ' ' + text }));
    else if (activeTab === 'sentiment') setFormData(p => ({ ...p, reviewText: p.reviewText + ' ' + text }));
    else if (activeTab === 'chat') setFormData(p => ({ ...p, chatMessage: text }));
    else if (activeTab === 'repurpose') setFormData(p => ({...p, marketingText: p.marketingText + ' ' + text}));
    else if (activeTab === 'startup_lab') setFormData(p => ({...p, suiteDescription: p.suiteDescription + ' ' + text}));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSave = (id: string) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedItems(newSaved);
  };

  const handleExportSimulation = () => {
    alert("Export simulation — backend integration required.");
  };

  // Handlers for generation
  const handleGenerate = async () => {
    setLoading(true);
    // Clear previous results based on tab
    if (activeTab === 'brand') setBrandResult(null);
    else if (activeTab === 'logo') setLogoResult(null);
    else if (activeTab === 'content') setContentResult(null);
    else if (activeTab === 'design') setDesignResult(null);
    else if (activeTab === 'sentiment') setSentimentResult(null);
    else if (activeTab === 'social') setSocialResult(null);
    else if (activeTab === 'competitor') setCompetitorResult(null);
    else if (activeTab === 'trends') setTrendResult(null);
    else if (activeTab === 'repurpose') setRepurposeResult(null);
    else if (activeTab === 'growth') setGrowthResult(null);
    else if (activeTab === 'startup_lab') setBrandSuiteResult(null);

    try {
      if (activeTab === 'brand') {
        const res = await ApiService.generateBrand({ 
          industry: formData.industry, keywords: formData.keywords, tone: formData.tone, language: formData.language,
          generateNames: formData.generateNames, generateTaglines: formData.generateTaglines, generateSlogans: formData.generateSlogans
        });
        setBrandResult(res);
      } else if (activeTab === 'logo') {
        const res = await ApiService.generateLogo({
          brandName: formData.brandName, industry: formData.industry, keywords: formData.keywords
        });
        setLogoResult(res);
      } else if (activeTab === 'content') {
        const res = await ApiService.generateContent({
          brandDescription: formData.brandDesc, tone: formData.tone, contentType: formData.contentType as any, language: formData.language
        });
        setContentResult(res);
      } else if (activeTab === 'design') {
        const res = await ApiService.getColors({ tone: formData.tone, industry: formData.industry });
        setDesignResult(res);
      } else if (activeTab === 'sentiment') {
        const res = await ApiService.analyzeSentiment({ text: formData.reviewText });
        setSentimentResult(res);
      } else if (activeTab === 'social') {
        const res = await ApiService.generateSocialMedia({
          brandName: formData.brandName, industry: formData.industry, goal: formData.campaignGoal, platforms: formData.platforms, frequency: formData.postFrequency
        });
        setSocialResult(res);
      } else if (activeTab === 'competitor') {
        const res = await ApiService.scanCompetitor({ competitorName: formData.competitorName, link: formData.competitorLink });
        setCompetitorResult(res);
      } else if (activeTab === 'trends') {
        const res = await ApiService.predictTrends({ industry: formData.industry, audience: formData.targetAudience });
        setTrendResult(res);
      } else if (activeTab === 'repurpose') {
        const res = await ApiService.repurposeContent({ content: formData.marketingText });
        setRepurposeResult(res);
      } else if (activeTab === 'growth') {
        const res = await ApiService.simulateGrowth({ 
          instagramUrl: formData.instagramUrl, linkedinUrl: formData.linkedinUrl, twitterUrl: formData.twitterUrl,
          facebookUrl: formData.facebookUrl, youtubeUrl: formData.youtubeUrl
        });
        setGrowthResult(res);
      } else if (activeTab === 'startup_lab') {
        const res = await ApiService.generateBrandSuite({
          industry: formData.industry,
          description: formData.suiteDescription,
          tone: formData.tone,
          keywords: formData.keywords,
          includeNames: formData.includeSuiteNames,
          includeTaglines: formData.includeSuiteTaglines,
          includeLogos: formData.includeSuiteLogos,
          includeStory: formData.includeSuiteStory,
          includeProductDesc: formData.includeSuiteProduct,
          includeInvestorPitch: formData.includeSuitePitch
        });
        setBrandSuiteResult(res);
      }
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Something went wrong. Try again.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!formData.chatMessage.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: formData.chatMessage, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setFormData(prev => ({ ...prev, chatMessage: '' }));
    
    setLoading(true);
    try {
      const response = await ApiService.chat(userMsg.content);
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: Date.now() }]);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Chat request failed.';
      setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: msg, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadText = (filename: string, text: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  // Navigation Items
  const navItems = [
    { id: 'startup_lab', label: 'AI Brand Suite Generator', icon: Rocket },
    { id: 'brand', label: 'Brand Generator', icon: LayoutDashboard },
    { id: 'logo', label: 'Logo Creator', icon: ImageIcon },
    { id: 'content', label: 'Marketing Content', icon: FileText },
    { id: 'design', label: 'Design System', icon: Palette },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: Sparkles },
    // Advanced Modules
    { id: 'social', label: 'Social Auto-Pilot', icon: Share },
    { id: 'competitor', label: 'Competitor Intel', icon: Search },
    { id: 'trends', label: 'Trend Intelligence', icon: TrendingUp },
    { id: 'repurpose', label: 'Content Repurposer', icon: Repeat },
    { id: 'growth', label: 'Social Growth Analyzer', icon: BarChart2 },
    { id: 'chat', label: 'AI Consultant', icon: MessageSquare },
  ];

  const toneOptions = [
    { label: 'Professional', value: 'Professional' },
    { label: 'Modern', value: 'Modern' },
    { label: 'Playful', value: 'Playful' },
    { label: 'Luxury', value: 'Luxury' },
    { label: 'Minimalist', value: 'Minimalist' },
    { label: 'Bold', value: 'Bold' },
  ];

  const langOptions = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Hindi', value: 'hi' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-white font-sans overflow-hidden bg-grid-pattern">
      {/* Sidebar */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-full md:w-72'} bg-[#0f172a]/80 border-r border-white/5 flex flex-col fixed md:relative z-30 h-full transition-all duration-300 backdrop-blur-xl shadow-2xl`}
      >
        <div className={`p-6 border-b border-white/5 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 cursor-pointer overflow-hidden" onClick={() => onNavigate('landing')}>
            <div className="w-9 h-9 min-w-[36px] rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">B</div>
            {!sidebarCollapsed && <span className="font-display font-bold text-xl tracking-tight text-white whitespace-nowrap">BizForge</span>}
          </div>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden md:block text-gray-400 hover:text-white transition-colors">
            {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-white shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title={sidebarCollapsed ? item.label : ''}
            >
              {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>}
              <item.icon size={22} className={`min-w-[22px] transition-colors ${activeTab === item.id ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {!sidebarCollapsed && <span className="font-medium text-[15px]">{item.label}</span>}
              {!sidebarCollapsed && activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           {!sidebarCollapsed ? (
             <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-4 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
               <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/20 blur-2xl rounded-full"></div>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Credits</span>
                 <span className="text-xs font-bold text-white">850 / 1000</span>
               </div>
               <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-3 overflow-hidden">
                 <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-[85%] animate-pulse"></div>
               </div>
               <button className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Upgrade Plan →</button>
             </div>
           ) : (
             <div className="flex justify-center">
               <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 flex items-center justify-center">
                 <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-[8px] flex items-center justify-center font-bold">85%</div>
               </div>
             </div>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0 h-screen scroll-smooth">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <button className="md:hidden text-gray-400 mr-2" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><PanelLeftOpen /></button>
             <nav className="flex items-center text-sm text-gray-500">
                <span className="hover:text-gray-300 cursor-pointer">Dashboard</span>
                <ChevronRight size={14} className="mx-1" />
                <span className="text-indigo-400 font-medium bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 whitespace-nowrap">{activeTab.replace('_', ' ').replace('startup lab', 'AI Brand Suite')}</span>
             </nav>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
             <div className="hidden sm:flex items-center gap-2 bg-[#0f172a] px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 transition-all shadow-sm">
                <Languages size={16} className="text-gray-400" />
                <select 
                  className="bg-transparent text-sm outline-none text-gray-300 w-24 cursor-pointer"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  {langOptions.map(l => <option key={l.value} value={l.value} className="bg-slate-900">{l.label}</option>)}
                </select>
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 border-2 border-[#020617] ring-1 ring-white/10 shadow-lg cursor-pointer hover:scale-105 transition-transform"></div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Startup Lab (Brand Suite) */}
          {activeTab === 'startup_lab' && (
             <div className="grid lg:grid-cols-12 gap-8">
               <div className="lg:col-span-5 space-y-6">
                  <Card className="sticky top-24" hoverEffect>
                     <div className="flex items-center gap-3 mb-2">
                       <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400"><Rocket size={20} /></div>
                       <div>
                         <h3 className="text-lg font-semibold text-white">AI Brand Suite Generator</h3>
                         <p className="text-xs text-gray-400">Orchestrate your entire brand launch.</p>
                       </div>
                     </div>
                     <div className="space-y-5 mt-6">
                        <Input label="Industry" placeholder="e.g. Fintech, Organic Skincare" value={formData.industry} onChange={(e) => handleInputChange('industry', e.target.value)} />
                        
                        <div className="relative">
                          <Textarea label="Brand / Startup Description" placeholder="Describe your startup, product, mission, target market, and unique value proposition…" className="h-32" value={formData.suiteDescription} onChange={(e) => handleInputChange('suiteDescription', e.target.value)} />
                          <div className="absolute right-2 bottom-[14px]">
                            <VoiceInput isListening={isListening} toggleListening={toggleListening} onTranscript={(t) => handleInputChange('suiteDescription', formData.suiteDescription + ' ' + t)} />
                          </div>
                        </div>

                        <Select label="Brand Tone" options={toneOptions} value={formData.tone} onChange={(e) => handleInputChange('tone', e.target.value)} />

                        <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 space-y-3">
                           <label className="text-sm font-medium text-gray-300 block mb-2">What do you need?</label>
                           <div className="grid grid-cols-2 gap-3">
                              <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                                 <input type="checkbox" checked={formData.includeSuiteNames} onChange={(e) => handleInputChange('includeSuiteNames', e.target.checked)} className="rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                 Brand Names
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                                 <input type="checkbox" checked={formData.includeSuiteTaglines} onChange={(e) => handleInputChange('includeSuiteTaglines', e.target.checked)} className="rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                 Taglines
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                                 <input type="checkbox" checked={formData.includeSuiteLogos} onChange={(e) => handleInputChange('includeSuiteLogos', e.target.checked)} className="rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                 Logos
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                                 <input type="checkbox" checked={formData.includeSuiteStory} onChange={(e) => handleInputChange('includeSuiteStory', e.target.checked)} className="rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                 Brand Story
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer">
                                 <input type="checkbox" checked={formData.includeSuiteProduct} onChange={(e) => handleInputChange('includeSuiteProduct', e.target.checked)} className="rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                 Product Desc.
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer col-span-2">
                                 <input type="checkbox" checked={formData.includeSuitePitch} onChange={(e) => handleInputChange('includeSuitePitch', e.target.checked)} className="rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                                 Investor Pitch Deck
                              </label>
                           </div>
                        </div>

                        <Button variant="gradient" className="w-full h-12 text-lg shadow-indigo-500/20" onClick={handleGenerate} isLoading={loading}>
                           <Sparkles className="w-5 h-5 mr-2" /> Generate Brand Kit
                        </Button>
                     </div>
                  </Card>
               </div>
               <div className="lg:col-span-7">
                  {loading ? (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                           <span>Orchestrating AI Services...</span>
                           <span className="animate-pulse">Processing</span>
                        </div>
                        <ProgressBar value={65} className="h-1.5" color="bg-indigo-500" />
                        <div className="grid gap-4">
                           <Skeleton className="h-32 w-full" />
                           <div className="grid grid-cols-2 gap-4">
                              <Skeleton className="h-40 w-full" />
                              <Skeleton className="h-40 w-full" />
                           </div>
                           <Skeleton className="h-64 w-full" />
                        </div>
                     </div>
                  ) : brandSuiteResult ? (
                     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-between items-center">
                           <h2 className="text-2xl font-bold font-display text-white">Your Brand Suite</h2>
                           <Button variant="outline" size="sm" onClick={handleExportSimulation}><Package size={16} className="mr-2" /> Download Kit</Button>
                        </div>

                        {/* Brand Identity Section */}
                        {(brandSuiteResult.names || brandSuiteResult.taglines) && (
                           <section className="space-y-4">
                              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Fingerprint size={16}/> Identity</h3>
                              <div className="grid gap-4">
                                 {brandSuiteResult.names?.map((n, i) => (
                                    <div key={i} className="glass-panel p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-indigo-500/30 transition-all">
                                       <div>
                                          <h4 className="text-xl font-bold text-white mb-1">{n.name}</h4>
                                          <p className="text-sm text-gray-400">{n.explanation}</p>
                                       </div>
                                       <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(n.name)}><Copy size={14}/></Button>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                              {brandSuiteResult.taglines && (
                                 <div className="grid md:grid-cols-2 gap-3">
                                    {brandSuiteResult.taglines.map((t, i) => (
                                       <div key={i} className="bg-white/5 p-3 rounded-lg text-sm text-gray-300 border border-white/5 italic text-center">"{t}"</div>
                                    ))}
                                 </div>
                              )}
                           </section>
                        )}

                        {/* Visuals Section */}
                        {brandSuiteResult.logos && (
                           <section className="space-y-4">
                              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={16}/> Visuals</h3>
                              <div className="grid grid-cols-2 gap-6">
                                 {brandSuiteResult.logos.map((logo, i) => (
                                    <div key={i} className="group relative aspect-square bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                       <img src={logo.url} alt="Generated Logo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <Button size="sm" variant="secondary" onClick={() => downloadText('logo_prompt.txt', logo.prompt)}>Prompt</Button>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </section>
                        )}

                        {/* Narrative Section */}
                        {(brandSuiteResult.brandStory || brandSuiteResult.productDescriptions) && (
                           <section className="space-y-4">
                              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><FileText size={16}/> Narrative</h3>
                              {brandSuiteResult.brandStory && (
                                 <Card>
                                    <h4 className="text-xs text-gray-500 font-bold uppercase mb-3">Brand Story</h4>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{brandSuiteResult.brandStory}</p>
                                 </Card>
                              )}
                              {brandSuiteResult.productDescriptions && (
                                 <div className="grid gap-4">
                                    {brandSuiteResult.productDescriptions.map((pd, i) => (
                                       <Card key={i}>
                                          <h4 className="text-white font-bold mb-2">{pd.title}</h4>
                                          <p className="text-sm text-gray-400 leading-relaxed">{pd.content}</p>
                                       </Card>
                                    ))}
                                 </div>
                              )}
                           </section>
                        )}

                        {/* Investor Pitch Section */}
                        {brandSuiteResult.investorPitch && (
                           <section className="space-y-4">
                              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2"><Presentation size={16}/> Investor Pitch Deck</h3>
                              <div className="grid gap-4">
                                <Card>
                                   <h4 className="text-xs text-amber-500 font-bold uppercase mb-2">Elevator Pitch</h4>
                                   <p className="text-lg text-white font-medium leading-relaxed">{brandSuiteResult.investorPitch.elevatorPitch}</p>
                                </Card>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                     <h5 className="text-xs text-gray-500 uppercase font-bold">The Problem</h5>
                                     <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-gray-300 text-sm">{brandSuiteResult.investorPitch.problem}</div>
                                  </div>
                                  <div className="space-y-2">
                                     <h5 className="text-xs text-gray-500 uppercase font-bold">The Solution</h5>
                                     <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-gray-300 text-sm">{brandSuiteResult.investorPitch.solution}</div>
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <h5 className="text-xs text-blue-400 uppercase font-bold mb-2">Market Opportunity</h5>
                                    <p className="text-gray-400 text-sm">{brandSuiteResult.investorPitch.market}</p>
                                  </div>
                                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <h5 className="text-xs text-purple-400 uppercase font-bold mb-2">Business Model</h5>
                                    <p className="text-gray-400 text-sm">{brandSuiteResult.investorPitch.businessModel}</p>
                                  </div>
                                </div>
                                <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
                                   <div className="flex justify-between items-start">
                                      <div>
                                         <h4 className="text-sm font-bold text-white mb-1">Funding Ask</h4>
                                         <p className="text-amber-200 text-lg font-display">{brandSuiteResult.investorPitch.fundingAsk}</p>
                                      </div>
                                      <Badge variant="warning">Series Seed</Badge>
                                   </div>
                                </Card>
                              </div>
                           </section>
                        )}

                        {/* Export Bundle Section */}
                        <section className="pt-8 border-t border-white/10">
                           <Card className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border-indigo-500/20">
                              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                 <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Export Brand Kit</h3>
                                    <p className="text-gray-400 text-sm mb-4">Download your assets ready for pitch decks and websites.</p>
                                    <div className="flex flex-wrap gap-2">
                                       <Badge variant="neutral">Brand Name</Badge>
                                       <Badge variant="neutral">Taglines</Badge>
                                       <Badge variant="neutral">Logo Mockups</Badge>
                                       <Badge variant="neutral">Brand Story</Badge>
                                       <Badge variant="neutral">Typography</Badge>
                                    </div>
                                 </div>
                                 <div className="flex flex-col w-full md:w-auto gap-3">
                                    <Button variant="primary" onClick={handleExportSimulation}>
                                       <FileCheck size={16} className="mr-2"/> Export as PDF Brand Kit
                                    </Button>
                                    <Button variant="secondary" onClick={handleExportSimulation}>
                                       <Briefcase size={16} className="mr-2"/> Download ZIP Assets
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleExportSimulation}>
                                       Download Text Copy Pack
                                    </Button>
                                 </div>
                              </div>
                           </Card>
                        </section>

                     </div>
                  ) : (
                     <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[500px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                           <Rocket className="w-10 h-10 text-indigo-400/50" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-300 mb-2">Ready for Lift-off?</h3>
                        <p className="max-w-md text-center text-gray-500">Describe your business on the left to generate a complete brand suite in seconds.</p>
                     </div>
                  )}
               </div>
             </div>
          )}

          {/* Social Auto-Pilot */}
          {activeTab === 'social' && (
             <div className="grid lg:grid-cols-12 gap-8">
               <div className="lg:col-span-4 space-y-6">
                 <Card className="sticky top-24" hoverEffect>
                   <div className="flex items-center gap-3 mb-6">
                     <div className="p-2.5 bg-pink-500/10 rounded-lg text-pink-400"><Share size={20} /></div>
                     <h3 className="text-lg font-semibold text-white">Social Auto-Pilot</h3>
                   </div>
                   <div className="space-y-5">
                     <Input label="Brand Name" value={formData.brandName} onChange={(e) => handleInputChange('brandName', e.target.value)} />
                     <Input label="Campaign Goal" placeholder="e.g. Brand Awareness" value={formData.campaignGoal} onChange={(e) => handleInputChange('campaignGoal', e.target.value)} />
                     <Select label="Post Frequency" options={[{label:'Daily', value:'Daily'}, {label:'Weekly', value:'Weekly'}]} value={formData.postFrequency} onChange={(e) => handleInputChange('postFrequency', e.target.value)} />
                     <Button variant="gradient" className="w-full mt-2" onClick={handleGenerate} isLoading={loading}>
                       Generate Campaign
                     </Button>
                   </div>
                 </Card>
               </div>
               <div className="lg:col-span-8">
                 {loading ? <Skeleton className="h-64 w-full" /> : socialResult ? (
                    <div className="space-y-6">
                      <Card>
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">30-Day Content Calendar</h4>
                        <div className="grid grid-cols-4 gap-4">
                          {socialResult.calendar.map((c, i) => (
                             <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 text-center">
                                <div className="text-xs text-gray-500 mb-1">Day {c.day}</div>
                                <div className="font-medium text-sm text-white mb-1 truncate" title={c.title}>{c.title}</div>
                                <Badge variant="neutral">{c.type}</Badge>
                             </div>
                          ))}
                        </div>
                      </Card>
                      <Card>
                         <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Post Previews</h4>
                            <Tabs tabs={socialResult.posts.map(p => p.platform)} active={activeSocialTab} onChange={setActiveSocialTab} />
                         </div>
                         <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10">
                            {socialResult.posts.filter(p => p.platform === activeSocialTab).map((post, idx) => (
                               <div key={idx} className="space-y-4">
                                  <div className="flex items-center gap-3 mb-2">
                                     <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                                     <div className="text-sm font-bold">{formData.brandName}</div>
                                  </div>
                                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                  <div className="text-blue-400 text-sm">{post.hashtags.join(' ')}</div>
                               </div>
                            ))}
                         </div>
                      </Card>
                    </div>
                 ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                      <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mb-4">
                        <Share className="w-8 h-8 text-pink-400/50" />
                      </div>
                      <p className="font-medium text-gray-400 mb-2">Automate your social strategy</p>
                      <div className="grid grid-cols-2 gap-4 opacity-30 w-full max-w-sm">
                         <div className="h-20 bg-white/10 rounded-lg"></div>
                         <div className="h-20 bg-white/10 rounded-lg"></div>
                      </div>
                    </div>
                 )}
               </div>
             </div>
          )}

          {/* AI Competitor Scanner */}
          {activeTab === 'competitor' && (
             <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                   <Card className="sticky top-24" hoverEffect>
                     <div className="flex items-center gap-3 mb-6">
                       <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-400"><Search size={20} /></div>
                       <h3 className="text-lg font-semibold text-white">Competitor Intel</h3>
                     </div>
                     <div className="space-y-5">
                       <Input label="Competitor Name" value={formData.competitorName} onChange={(e) => handleInputChange('competitorName', e.target.value)} />
                       <Input label="Website/Social Link" value={formData.competitorLink} onChange={(e) => handleInputChange('competitorLink', e.target.value)} />
                       <Button variant="gradient" className="w-full mt-2" onClick={handleGenerate} isLoading={loading}>
                         Scan Competitor
                       </Button>
                     </div>
                   </Card>
                </div>
                <div className="lg:col-span-8">
                   {loading ? <Skeleton className="h-64 w-full" /> : competitorResult ? (
                      <div className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Activity</h4>
                               <div className="space-y-4">
                                  <div>
                                     <span className="text-xs text-gray-500 block">Post Frequency</span>
                                     <span className="text-lg font-bold text-white">{competitorResult.frequency}</span>
                                  </div>
                                  <div>
                                     <span className="text-xs text-gray-500 block">Engagement Rate</span>
                                     <span className="text-lg font-bold text-white">{competitorResult.engagement}</span>
                                  </div>
                               </div>
                            </Card>
                            <Card>
                               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Visual Style</h4>
                               <p className="text-gray-300">{competitorResult.visualStyle}</p>
                            </Card>
                         </div>
                         <Card>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Strategic Insights</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                               <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                                  <h5 className="font-bold text-red-400 mb-2">Content Gaps</h5>
                                  <ul className="space-y-1 text-sm text-gray-400 list-disc list-inside">
                                     {competitorResult.gaps.map((g, i) => <li key={i}>{g}</li>)}
                                  </ul>
                               </div>
                               <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                                  <h5 className="font-bold text-green-400 mb-2">Your Opportunities</h5>
                                  <ul className="space-y-1 text-sm text-gray-400 list-disc list-inside">
                                     {competitorResult.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                                  </ul>
                               </div>
                            </div>
                         </Card>
                      </div>
                   ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-orange-400/50" />
                        </div>
                        <p className="font-medium text-gray-400 mb-4">Spy on the competition</p>
                        <div className="flex gap-4 opacity-30">
                           <div className="w-16 h-16 bg-white/10 rounded-full"></div>
                           <div className="w-16 h-16 bg-white/10 rounded-full"></div>
                           <div className="w-16 h-16 bg-white/10 rounded-full"></div>
                        </div>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* Trend Prediction Engine */}
          {activeTab === 'trends' && (
             <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                   <Card className="sticky top-24" hoverEffect>
                     <div className="flex items-center gap-3 mb-6">
                       <div className="p-2.5 bg-red-500/10 rounded-lg text-red-400"><TrendingUp size={20} /></div>
                       <h3 className="text-lg font-semibold text-white">Trend Intel</h3>
                     </div>
                     <div className="space-y-5">
                       <Input label="Industry" value={formData.industry} onChange={(e) => handleInputChange('industry', e.target.value)} />
                       <Input label="Target Audience" value={formData.targetAudience} onChange={(e) => handleInputChange('targetAudience', e.target.value)} />
                       <Button variant="gradient" className="w-full mt-2" onClick={handleGenerate} isLoading={loading}>
                         Predict Trends
                       </Button>
                     </div>
                   </Card>
                </div>
                <div className="lg:col-span-8">
                   {loading ? <Skeleton className="h-64 w-full" /> : trendResult ? (
                      <div className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-4">
                            {trendResult.topics.map((topic, i) => (
                               <Card key={i} className="hover:border-red-500/30 transition-colors">
                                  <div className="flex justify-between items-start mb-2">
                                     <h4 className="font-bold text-lg text-white">{topic.topic}</h4>
                                     <Badge variant={topic.urgency === 'High' ? 'error' : 'warning'}>{topic.urgency}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                     <span className="text-xs text-gray-500">Relevance</span>
                                     <ProgressBar value={topic.relevance} color="bg-red-500" className="flex-1 h-1.5" />
                                  </div>
                               </Card>
                            ))}
                         </div>
                         <Card className="bg-gradient-to-r from-red-900/10 to-orange-900/10 border-red-500/20">
                            <h4 className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2">Viral Content Idea</h4>
                            <p className="text-lg text-white font-medium">"{trendResult.viralIdea}"</p>
                            <div className="mt-2 text-xs text-gray-500">Recommended action: Post within 48h</div>
                         </Card>
                      </div>
                   ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                          <TrendingUp className="w-8 h-8 text-red-400/50" />
                        </div>
                        <p className="font-medium text-gray-400 mb-4">Discover emerging topics</p>
                        <div className="w-48 h-2 bg-white/10 rounded-full opacity-30 mb-2"></div>
                        <div className="w-32 h-2 bg-white/10 rounded-full opacity-30"></div>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* Smart Content Repurposer */}
          {activeTab === 'repurpose' && (
             <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-6">
                   <Card className="sticky top-24" hoverEffect>
                     <div className="flex items-center gap-3 mb-6">
                       <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400"><Repeat size={20} /></div>
                       <h3 className="text-lg font-semibold text-white">Repurposer</h3>
                     </div>
                     <div className="space-y-5">
                       <div className="relative">
                          <Textarea label="Source Text (Blog/Article)" className="h-64" value={formData.marketingText} onChange={(e) => handleInputChange('marketingText', e.target.value)} />
                          <div className="absolute right-2 bottom-[14px]">
                            <VoiceInput isListening={isListening} toggleListening={toggleListening} onTranscript={(t) => handleInputChange('marketingText', formData.marketingText + ' ' + t)} />
                          </div>
                       </div>
                       <Button variant="gradient" className="w-full mt-2" onClick={handleGenerate} isLoading={loading}>
                         Repurpose Content
                       </Button>
                     </div>
                   </Card>
                </div>
                <div className="lg:col-span-7">
                   {loading ? <Skeleton className="h-64 w-full" /> : repurposeResult ? (
                      <div className="space-y-6">
                         <Card>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Twitter Thread</h4>
                            <div className="space-y-3">
                               {repurposeResult.tweets.map((t, i) => (
                                  <div key={i} className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 text-sm text-gray-300">
                                     {t}
                                  </div>
                               ))}
                            </div>
                         </Card>
                         <Card>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">LinkedIn Post</h4>
                            <div className="space-y-3">
                               {repurposeResult.linkedin.map((l, i) => (
                                  <p key={i} className="text-gray-300 text-sm">{l}</p>
                               ))}
                            </div>
                         </Card>
                         <div className="grid md:grid-cols-2 gap-4">
                            <Card>
                               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Instagram</h4>
                               <p className="text-xs text-gray-400">{repurposeResult.instagram}</p>
                            </Card>
                            <Card>
                               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Newsletter</h4>
                               <p className="text-xs text-gray-400 whitespace-pre-wrap">{repurposeResult.newsletter}</p>
                            </Card>
                         </div>
                      </div>
                   ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                          <Repeat className="w-8 h-8 text-indigo-400/50" />
                        </div>
                        <p className="font-medium text-gray-400 mb-4">Turn one post into ten</p>
                        <div className="grid grid-cols-2 gap-2 opacity-30">
                           <div className="w-12 h-16 bg-white/10 rounded"></div>
                           <div className="w-12 h-16 bg-white/10 rounded"></div>
                        </div>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* Social Growth Analyzer */}
          {activeTab === 'growth' && (
             <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                   <Card className="sticky top-24" hoverEffect>
                     <div className="flex items-center gap-3 mb-6">
                       <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400"><BarChart2 size={20} /></div>
                       <h3 className="text-lg font-semibold text-white">Social Growth Analyzer</h3>
                     </div>
                     <div className="space-y-4">
                       <p className="text-xs text-gray-400">Enter your public profile URLs to analyze.</p>
                       <Input label="Instagram URL" placeholder="https://instagram.com/..." value={formData.instagramUrl} onChange={(e) => handleInputChange('instagramUrl', e.target.value)} />
                       <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/..." value={formData.linkedinUrl} onChange={(e) => handleInputChange('linkedinUrl', e.target.value)} />
                       <Input label="Twitter/X URL" placeholder="https://twitter.com/..." value={formData.twitterUrl} onChange={(e) => handleInputChange('twitterUrl', e.target.value)} />
                       <Input label="Facebook URL" placeholder="https://facebook.com/..." value={formData.facebookUrl} onChange={(e) => handleInputChange('facebookUrl', e.target.value)} />
                       <Input label="YouTube URL" placeholder="https://youtube.com/..." value={formData.youtubeUrl} onChange={(e) => handleInputChange('youtubeUrl', e.target.value)} />
                       
                       <Button variant="gradient" className="w-full mt-2" onClick={handleGenerate} isLoading={loading}>
                         Analyze Growth
                       </Button>
                     </div>
                   </Card>
                </div>
                <div className="lg:col-span-8">
                   {loading ? <Skeleton className="h-64 w-full" /> : growthResult ? (
                      <div className="space-y-6">
                         {/* Platform Metrics */}
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {growthResult.platformMetrics.map((m, i) => (
                               <Card key={i} className="text-center p-4">
                                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{m.platform}</div>
                                  <div className="text-2xl font-bold text-white mb-1">{m.followers.toLocaleString()}</div>
                                  <div className="flex justify-center gap-2 text-xs">
                                     <span className="text-emerald-400">{m.growth}</span>
                                     <span className="text-gray-600">|</span>
                                     <span className="text-blue-400">{m.engagement} Eng.</span>
                                  </div>
                               </Card>
                            ))}
                         </div>

                         <Card>
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Growth Forecast (Next 4 Months)</h4>
                            <div className="flex items-end gap-4 h-48 w-full px-4">
                               {growthResult.forecast.map((f, i) => (
                                  <div key={i} className="flex-1 flex flex-col justify-end items-center group">
                                     <div className="text-xs text-emerald-400 font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{f.followers.toLocaleString()}</div>
                                     <div 
                                        className="w-full bg-emerald-500/20 border-t-2 border-emerald-500 rounded-t-lg transition-all hover:bg-emerald-500/40 relative" 
                                        style={{ height: `${(f.followers / (growthResult.totalFollowers * 1.5)) * 100}%` }}
                                     >
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/20 to-transparent"></div>
                                     </div>
                                     <div className="text-xs text-gray-500 mt-2 font-medium">{f.month}</div>
                                  </div>
                               ))}
                            </div>
                         </Card>
                         
                         <Card className="bg-gradient-to-r from-emerald-900/10 to-green-900/10 border-emerald-500/20">
                            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">AI Recommendations</h4>
                            <ul className="space-y-3">
                               {growthResult.contentRecommendations.map((rec, i) => (
                                  <li key={i} className="flex items-start gap-3">
                                     <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                     <span className="text-gray-300 text-sm">{rec}</span>
                                  </li>
                               ))}
                            </ul>
                         </Card>
                      </div>
                   ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                          <BarChart2 className="w-8 h-8 text-emerald-400/50" />
                        </div>
                        <p className="font-medium text-gray-400 mb-4">Predict your social trajectory</p>
                        {/* Sample Chart Placeholder */}
                        <div className="flex items-end gap-2 h-16 opacity-30">
                           <div className="w-4 h-8 bg-white/20 rounded-t"></div>
                           <div className="w-4 h-12 bg-white/20 rounded-t"></div>
                           <div className="w-4 h-10 bg-white/20 rounded-t"></div>
                           <div className="w-4 h-16 bg-white/20 rounded-t"></div>
                        </div>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* Brand Name Generator */}
          {activeTab === 'brand' && (
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <Card className="sticky top-24" hoverEffect>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400"><LayoutDashboard size={20} /></div>
                    <h3 className="text-lg font-semibold text-white">Brand Parameters</h3>
                  </div>
                  <div className="space-y-5">
                    <Input label="Industry" placeholder="e.g. SaaS, Coffee Shop" value={formData.industry} onChange={(e) => handleInputChange('industry', e.target.value)} />
                    <div className="relative">
                      <Input label="Keywords" placeholder="e.g. fast, smart, ai" value={formData.keywords} onChange={(e) => handleInputChange('keywords', e.target.value)} />
                      <div className="absolute right-2 top-[30px]">
                         <VoiceInput isListening={isListening} toggleListening={toggleListening} onTranscript={(t) => handleInputChange('keywords', formData.keywords + ' ' + t)} />
                      </div>
                    </div>
                    <Select label="Tone" options={toneOptions} value={formData.tone} onChange={(e) => handleInputChange('tone', e.target.value)} />
                    
                    <div className="space-y-3 pt-2">
                       <label className="text-sm font-medium text-gray-400">Output Options</label>
                       <div className="flex items-center gap-3">
                         <input type="checkbox" id="genNames" className="w-4 h-4 rounded bg-[#0f172a] border-gray-600 text-indigo-500 focus:ring-indigo-500" checked={formData.generateNames} onChange={(e) => handleInputChange('generateNames', e.target.checked)} />
                         <label htmlFor="genNames" className="text-sm text-gray-300">Brand Names</label>
                       </div>
                       <div className="flex items-center gap-3">
                         <input type="checkbox" id="genTags" className="w-4 h-4 rounded bg-[#0f172a] border-gray-600 text-indigo-500 focus:ring-indigo-500" checked={formData.generateTaglines} onChange={(e) => handleInputChange('generateTaglines', e.target.checked)} />
                         <label htmlFor="genTags" className="text-sm text-gray-300">Taglines</label>
                       </div>
                       <div className="flex items-center gap-3">
                         <input type="checkbox" id="genSlogans" className="w-4 h-4 rounded bg-[#0f172a] border-gray-600 text-indigo-500 focus:ring-indigo-500" checked={formData.generateSlogans} onChange={(e) => handleInputChange('generateSlogans', e.target.checked)} />
                         <label htmlFor="genSlogans" className="text-sm text-gray-300">Slogans</label>
                       </div>
                    </div>

                    <Button variant="gradient" className="w-full mt-2" onClick={handleGenerate} isLoading={loading}>
                      <Sparkles className="w-4 h-4 mr-2" /> Generate Assets
                    </Button>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-8">
                {loading ? (
                   <div className="space-y-4">
                     <Skeleton className="h-32 w-full" />
                     <Skeleton className="h-20 w-full" />
                     <Skeleton className="h-20 w-full" />
                   </div>
                ) : brandResult ? (
                  <div className="space-y-8">
                     {/* Names */}
                     {brandResult.names && brandResult.names.length > 0 && (
                       <div>
                         <div className="flex justify-between items-center pb-4">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Brand Names</h4>
                         </div>
                         <div className="grid gap-4 sm:grid-cols-2">
                          {brandResult.names.map((item, idx) => (
                            <Card key={idx} className="group transition-all cursor-pointer hover:border-indigo-500/30">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 group-hover:from-blue-300 group-hover:to-purple-300 transition-all">{item.name}</h4>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={(e) => { e.stopPropagation(); toggleSave(item.name); }} className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${savedItems.has(item.name) ? 'text-rose-500' : 'text-gray-400'}`}>
                                    <Heart size={16} fill={savedItems.has(item.name) ? "currentColor" : "none"} />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); copyToClipboard(item.name); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    <Copy size={16} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 leading-relaxed mb-3">{item.explanation}</p>
                              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                 <div className="flex items-center gap-1.5">
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                   <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">.com available</span>
                                 </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                       </div>
                     )}

                     {/* Taglines */}
                     {brandResult.taglines && brandResult.taglines.length > 0 && (
                       <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Taglines</h4>
                          <div className="grid gap-3">
                             {brandResult.taglines.map((t, i) => (
                               <div key={i} className="glass-panel p-4 rounded-xl flex justify-between items-center group">
                                  <span className="text-gray-300 text-lg font-medium">"{t}"</span>
                                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(t)}><Copy size={14}/></Button>
                               </div>
                             ))}
                          </div>
                       </div>
                     )}

                     {/* Slogans */}
                     {brandResult.slogans && brandResult.slogans.length > 0 && (
                       <div>
                          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Slogans</h4>
                          <div className="grid gap-3">
                             {brandResult.slogans.map((s, i) => (
                               <div key={i} className="glass-panel p-4 rounded-xl border-l-4 border-indigo-500 flex justify-between items-center group">
                                  <span className="text-white text-lg font-display font-bold">"{s}"</span>
                                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(s)}><Copy size={14}/></Button>
                               </div>
                             ))}
                          </div>
                       </div>
                     )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                    {/* Placeholder with Examples */}
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mb-6 animate-float">
                      <LayoutDashboard className="w-10 h-10 text-indigo-400/50" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-300 mb-2">Start your journey</h3>
                    <p className="max-w-md text-center text-gray-500 mb-8">Select options to generate brand names, taglines, or slogans.</p>
                    
                    {/* Example Visuals */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-lg opacity-40 hover:opacity-100 transition-opacity">
                       <div className="bg-white/5 border border-white/5 rounded-lg p-3">
                          <div className="h-2 w-16 bg-blue-500/40 rounded mb-2"></div>
                          <div className="h-1.5 w-full bg-gray-600 rounded mb-1"></div>
                          <div className="h-1.5 w-2/3 bg-gray-600 rounded"></div>
                       </div>
                       <div className="bg-white/5 border border-white/5 rounded-lg p-3">
                          <div className="h-2 w-20 bg-purple-500/40 rounded mb-2"></div>
                          <div className="h-1.5 w-full bg-gray-600 rounded mb-1"></div>
                          <div className="h-1.5 w-2/3 bg-gray-600 rounded"></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Logo Generator */}
          {activeTab === 'logo' && (
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <Card className="sticky top-24" hoverEffect>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400"><ImageIcon size={20} /></div>
                     <h3 className="text-lg font-semibold text-white">Logo Studio</h3>
                  </div>
                  <div className="space-y-5">
                    <Input label="Brand Name" placeholder="e.g. BizForge" value={formData.brandName} onChange={(e) => handleInputChange('brandName', e.target.value)} />
                    <Input label="Industry" placeholder="e.g. Tech" value={formData.industry} onChange={(e) => handleInputChange('industry', e.target.value)} />
                    <div className="relative">
                      <Input label="Keywords / Style" placeholder="e.g. minimalist, gradient" value={formData.keywords} onChange={(e) => handleInputChange('keywords', e.target.value)} />
                      <div className="absolute right-2 top-[30px]">
                        <VoiceInput isListening={isListening} toggleListening={toggleListening} onTranscript={(t) => handleInputChange('keywords', formData.keywords + ' ' + t)} />
                      </div>
                    </div>
                    <Button variant="gradient" className="w-full mt-2" onClick={handleGenerate} isLoading={loading}>
                       <Sparkles className="w-4 h-4 mr-2" /> Generate Logo
                    </Button>
                    <div className="text-xs text-center text-gray-500">Powered by Stable Diffusion XL</div>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-8 flex flex-col">
                {loading ? (
                   <Card className="h-full min-h-[500px] flex items-center justify-center flex-col">
                     <div className="relative w-32 h-32 mb-8">
                       <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
                       <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                     </div>
                     <p className="text-indigo-300 font-medium animate-pulse">Generating Vector Art...</p>
                   </Card>
                ) : logoResult ? (
                   <div className="space-y-6">
                      <Card className="flex flex-col gap-6 overflow-visible">
                          <div className="aspect-square w-full max-w-lg mx-auto logo-checkerboard rounded-2xl overflow-hidden relative border border-white/[0.08] p-8 shadow-glow-sm">
                            <img src={logoResult.imageUrl} alt="Generated Logo" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-wrap items-center justify-center gap-3 py-1">
                            <Button variant="primary" size="sm" onClick={() => downloadImage(logoResult.imageUrl, 'bizforge-logo.png')}>
                              <Download size={16} className="mr-2" /> Download PNG
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={loading}>
                              <RefreshCw size={16} className="mr-2" /> Regenerate
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(logoResult.prompt)}>
                              <Copy size={16} className="mr-2" /> Copy prompt
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setShowLogoModal(true)}>
                              <Maximize2 size={16} className="mr-2" /> Preview
                            </Button>
                          </div>
                          <div className="p-4 bg-[#070B1A]/80 rounded-xl border border-white/[0.08] relative group">
                            <button onClick={() => copyToClipboard(logoResult.prompt)} className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-white bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              <Copy size={14} />
                            </button>
                            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-2">Generation Prompt</span>
                            <p className="text-xs text-gray-400 font-mono leading-relaxed">{logoResult.prompt}</p>
                          </div>
                      </Card>
                   </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[500px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                       <ImageIcon className="w-10 h-10 text-purple-400/50" />
                    </div>
                    <p className="text-gray-400 text-lg font-medium">Create your visual identity</p>
                    <p className="text-sm text-gray-600 mt-2 mb-8">Generate professional logos, favicons, and social icons.</p>
                    
                    {/* Placeholder Visuals */}
                    <div className="flex gap-4 opacity-40">
                       <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center"><div className="w-8 h-8 rounded-full bg-blue-500"></div></div>
                       <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center"><div className="w-8 h-8 rounded bg-purple-500 transform rotate-45"></div></div>
                       <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center"><div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-green-500"></div></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Marketing Content */}
          {activeTab === 'content' && (
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                 <Card className="sticky top-24" hoverEffect>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-green-500/10 rounded-lg text-green-400"><FileText size={20} /></div>
                      <h3 className="text-lg font-semibold text-white">Content Studio</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="relative">
                        <Textarea label="Brand/Product Description" placeholder="Describe what you are selling..." value={formData.brandDesc} onChange={(e) => handleInputChange('brandDesc', e.target.value)} className="min-h-[140px]" />
                        <div className="absolute right-2 bottom-[14px]">
                          <VoiceInput isListening={isListening} toggleListening={toggleListening} onTranscript={(t) => handleInputChange('brandDesc', formData.brandDesc + ' ' + t)} />
                        </div>
                      </div>
                      <Select label="Content Type" value={formData.contentType} onChange={(e) => handleInputChange('contentType', e.target.value)} options={[
                        { label: 'Social Media Post', value: 'social_post' },
                        { label: 'Product Description', value: 'product_desc' },
                        { label: 'Ad Copy', value: 'ad_copy' },
                        { label: 'Email Campaign', value: 'email' },
                      ]} />
                      <Select label="Tone" options={toneOptions} value={formData.tone} onChange={(e) => handleInputChange('tone', e.target.value)} />
                      <Button variant="gradient" className="w-full" onClick={handleGenerate} isLoading={loading}>
                        <Sparkles className="w-4 h-4 mr-2" /> Generate Copy
                      </Button>
                    </div>
                 </Card>
              </div>
              <div className="lg:col-span-7">
                {loading ? (
                   <Card className="h-full min-h-[400px]">
                     <div className="space-y-4 animate-pulse">
                        <div className="h-6 w-3/4 bg-white/5 rounded"></div>
                        <div className="h-4 w-full bg-white/5 rounded"></div>
                        <div className="h-4 w-full bg-white/5 rounded"></div>
                        <div className="h-4 w-2/3 bg-white/5 rounded"></div>
                        <div className="pt-8 space-y-2">
                           <div className="h-4 w-full bg-white/5 rounded"></div>
                           <div className="h-4 w-full bg-white/5 rounded"></div>
                        </div>
                     </div>
                   </Card>
                ) : contentResult ? (
                  <Card className="h-full flex flex-col border-t-4 border-t-green-500">
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-3">
                         <Badge variant="success">Groq LLaMA 3.3</Badge>
                         <span className="text-xs text-gray-500">{formData.tone} Tone</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(contentResult.content)} title="Copy">
                          <Copy size={18} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => downloadText('content.txt', contentResult.content)} title="Download">
                          <Download size={18} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 font-light text-lg leading-relaxed text-gray-200 whitespace-pre-wrap selection:bg-green-500/30 selection:text-green-200">
                      {contentResult.content}
                    </div>
                    <div className="mt-8 pt-4 border-t border-white/5 flex gap-2 justify-end">
                       <Button variant="outline" size="sm">Refine</Button>
                       <Button variant="outline" size="sm">Translate</Button>
                    </div>
                  </Card>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-green-400/50" />
                    </div>
                    <p className="font-medium text-gray-400 mb-6">AI Copywriter Ready</p>
                    
                    {/* Placeholder Visuals */}
                    <div className="w-64 space-y-3 opacity-40">
                       <div className="h-20 bg-white/5 border border-white/5 rounded-lg p-3">
                          <div className="flex gap-2 mb-2">
                             <div className="w-6 h-6 rounded-full bg-blue-500/50"></div>
                             <div className="h-2 w-20 bg-gray-600 rounded mt-2"></div>
                          </div>
                          <div className="h-1.5 w-full bg-gray-700 rounded mb-1"></div>
                          <div className="h-1.5 w-2/3 bg-gray-700 rounded"></div>
                       </div>
                       <div className="h-20 bg-white/5 border border-white/5 rounded-lg p-3">
                          <div className="flex gap-2 mb-2">
                             <div className="w-6 h-6 rounded-full bg-green-500/50"></div>
                             <div className="h-2 w-20 bg-gray-600 rounded mt-2"></div>
                          </div>
                          <div className="h-1.5 w-full bg-gray-700 rounded mb-1"></div>
                          <div className="h-1.5 w-2/3 bg-gray-700 rounded"></div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Design System */}
          {activeTab === 'design' && (
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-6">
                <Card className="sticky top-24" hoverEffect>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2.5 bg-pink-500/10 rounded-lg text-pink-400"><Palette size={20} /></div>
                     <h3 className="text-lg font-semibold text-white">Visual Identity</h3>
                  </div>
                  <div className="space-y-5">
                    <Select label="Tone" options={toneOptions} value={formData.tone} onChange={(e) => handleInputChange('tone', e.target.value)} />
                    <Input label="Industry" placeholder="e.g. Finance, Art" value={formData.industry} onChange={(e) => handleInputChange('industry', e.target.value)} />
                    <Button variant="gradient" className="w-full" onClick={handleGenerate} isLoading={loading}>
                       <Sparkles className="w-4 h-4 mr-2" /> Generate Palette
                    </Button>
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-8">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-2 gap-4"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>
                  </div>
                ) : designResult ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Card>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Color Palette</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {designResult.palette.map((color, idx) => (
                          <div key={idx} className="space-y-3 group cursor-pointer" onClick={() => copyToClipboard(color.hex)}>
                            <div className="h-28 rounded-2xl shadow-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl ring-1 ring-white/10 relative overflow-hidden" style={{ backgroundColor: color.hex }}>
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                               <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                 <div className="bg-black/50 backdrop-blur-md p-1.5 rounded text-white"><Copy size={12} /></div>
                               </div>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-white text-sm">{color.name}</p>
                              <p className="text-xs text-gray-500 font-mono group-hover:text-pink-400 transition-colors">{color.hex}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Live Preview Card */}
                    <div className="p-1 rounded-3xl bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 shadow-2xl overflow-hidden">
                       <div className="bg-white dark:bg-slate-950 p-6 rounded-[20px]" style={{ fontFamily: designResult.fonts.primary }}>
                          <div className="flex justify-between items-center mb-8">
                             <div className="font-bold text-xl" style={{ color: designResult.palette[0].hex, fontFamily: designResult.fonts.secondary }}>Brand Preview</div>
                             <div className="flex gap-4 text-sm font-medium text-slate-500">
                                <span>Home</span>
                                <span>About</span>
                                <span>Contact</span>
                             </div>
                          </div>
                          <div className="flex gap-6 items-center">
                             <div className="flex-1 space-y-4">
                               <h1 className="text-4xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: designResult.fonts.secondary }}>Design that speaks.</h1>
                               <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This is how your typography and color palette looks in a real interface context.</p>
                               <button className="px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: designResult.palette[1].hex }}>Get Started</button>
                             </div>
                             <div className="w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: designResult.palette[2].hex }}></div>
                          </div>
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <Card>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Typography</h4>
                          <div className="space-y-6">
                             <div>
                               <span className="text-xs text-gray-500 block mb-1">Headings</span>
                               <p className="text-3xl font-bold text-white" style={{ fontFamily: designResult.fonts.secondary }}>{designResult.fonts.secondary}</p>
                             </div>
                             <div>
                               <span className="text-xs text-gray-500 block mb-1">Body Text</span>
                               <p className="text-xl text-gray-300" style={{ fontFamily: designResult.fonts.primary }}>{designResult.fonts.primary}</p>
                             </div>
                          </div>
                       </Card>
                       <Card>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Usage Guide</h4>
                          <p className="text-sm text-gray-400 leading-relaxed">{designResult.styleGuide}</p>
                       </Card>
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[400px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                    <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mb-4">
                      <Palette className="w-8 h-8 text-pink-400/50" />
                    </div>
                    <p className="font-medium text-gray-400 mb-6">Generate Visual System</p>
                    
                    {/* Placeholder Visuals */}
                    <div className="flex gap-2 opacity-40">
                       <div className="w-10 h-24 rounded-lg bg-pink-500/40"></div>
                       <div className="w-10 h-24 rounded-lg bg-blue-500/40"></div>
                       <div className="w-10 h-24 rounded-lg bg-indigo-500/40"></div>
                       <div className="w-10 h-24 rounded-lg bg-slate-500/40"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          {activeTab === 'sentiment' && (
             <div className="grid lg:grid-cols-12 gap-8">
               <div className="lg:col-span-6 space-y-6">
                 <Card className="h-full flex flex-col" hoverEffect>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-yellow-500/10 rounded-lg text-yellow-400"><Sparkles size={20} /></div>
                      <h3 className="text-lg font-semibold text-white">Sentiment Decoder</h3>
                   </div>
                   <div className="flex-1 space-y-5">
                     <div className="relative h-full">
                        <Textarea 
                          label="Customer Feedback" 
                          placeholder="Paste a review, email, or comment here..." 
                          className="h-64 font-mono text-sm"
                          value={formData.reviewText} 
                          onChange={(e) => handleInputChange('reviewText', e.target.value)} 
                        />
                        <div className="absolute right-2 bottom-[14px]">
                          <VoiceInput isListening={isListening} toggleListening={toggleListening} onTranscript={(t) => handleInputChange('reviewText', formData.reviewText + ' ' + t)} />
                        </div>
                     </div>
                     <Button variant="gradient" className="w-full" onClick={handleGenerate} isLoading={loading}>
                        Analyze & Improve
                     </Button>
                   </div>
                 </Card>
               </div>
               <div className="lg:col-span-6">
                 {loading ? (
                    <div className="space-y-6">
                       <Skeleton className="h-40 w-full rounded-2xl" />
                       <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                 ) : sentimentResult ? (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                      <Card className={`border-l-4 ${sentimentResult.label === 'Positive' ? 'border-l-emerald-500' : sentimentResult.label === 'Negative' ? 'border-l-rose-500' : 'border-l-amber-500'}`}>
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="font-bold text-xl">Analysis Result</h4>
                           <Badge variant={sentimentResult.label === 'Positive' ? 'success' : sentimentResult.label === 'Negative' ? 'error' : 'warning'}>
                             {sentimentResult.label}
                           </Badge>
                        </div>
                        
                        <div className="mb-6">
                           <div className="flex justify-between text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">
                              <span>Confidence Score</span>
                              <span>{(sentimentResult.confidence * 100).toFixed(0)}%</span>
                           </div>
                           <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${sentimentResult.label === 'Positive' ? 'bg-emerald-500' : sentimentResult.label === 'Negative' ? 'bg-rose-500' : 'bg-amber-500'}`} 
                                style={{ width: `${sentimentResult.confidence * 100}%` }}
                             ></div>
                           </div>
                        </div>
                        
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                           <span className="text-xs text-gray-500 font-bold uppercase block mb-1">AI Insights</span>
                           <p className="text-sm text-gray-300">{sentimentResult.insights}</p>
                        </div>
                      </Card>

                      <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
                         <h4 className="font-bold text-lg mb-4 text-indigo-300 flex items-center gap-2"><Sparkles size={16} /> Recommended Rewrite</h4>
                         <div className="bg-[#020617]/50 p-4 rounded-xl border border-white/5 font-medium text-gray-200 italic leading-relaxed relative">
                           <span className="absolute -top-2 -left-2 text-4xl text-white/10">"</span>
                           {sentimentResult.rewrite}
                           <span className="absolute -bottom-4 -right-1 text-4xl text-white/10">"</span>
                         </div>
                         <div className="mt-4 flex justify-end">
                           <Button size="sm" variant="secondary" onClick={() => copyToClipboard(sentimentResult.rewrite)}><Copy size={14} className="mr-2" /> Copy</Button>
                         </div>
                      </Card>
                   </div>
                 ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-gray-500 min-h-[300px] border-2 border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-yellow-400/50" />
                    </div>
                    <p className="font-medium text-gray-400">Waiting for input...</p>
                  </div>
                 )}
               </div>
             </div>
          )}

          {/* AI Chatbot */}
          {activeTab === 'chat' && (
            <Card className="h-[calc(100vh-160px)] flex flex-col p-0 overflow-hidden border-0 shadow-2xl bg-[#0f172a]/80 backdrop-blur-md">
               <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="relative">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">AI</div>
                       <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0f172a] rounded-full"></div>
                    </div>
                    <div>
                       <div className="font-semibold text-sm text-white">Brand Consultant</div>
                       <div className="text-xs text-indigo-300">Powered by IBM Granite</div>
                    </div>
                 </div>
                 <Button variant="ghost" size="sm" onClick={() => setChatHistory([])}>Clear Chat</Button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-grid-pattern">
                 {chatHistory.map((msg) => (
                   <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-2xl shadow-md ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm' 
                          : 'bg-white/10 text-gray-100 rounded-tl-sm border border-white/5'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                   </div>
                 ))}
                 {loading && (
                   <div className="flex justify-start">
                     <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
                       <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300"></span>
                     </div>
                   </div>
                 )}
                 <div ref={chatEndRef} />
               </div>

               <div className="p-4 bg-[#0f172a] border-t border-white/5">
                 <div className="flex gap-2 relative">
                   <div className="flex-1 relative">
                      <Input 
                        placeholder="Ask for branding advice..." 
                        value={formData.chatMessage} 
                        onChange={(e) => handleInputChange('chatMessage', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                        className="pr-12 bg-white/5 border-white/10 focus:bg-white/10 h-12 rounded-full px-6"
                      />
                      <div className="absolute right-3 top-2">
                         <VoiceInput isListening={isListening} toggleListening={toggleListening} onTranscript={(t) => handleInputChange('chatMessage', t)} />
                      </div>
                   </div>
                   <Button onClick={handleChatSend} disabled={loading || !formData.chatMessage} className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500">
                     <Send size={20} className={loading ? 'opacity-0' : 'ml-1'} />
                   </Button>
                 </div>
               </div>
            </Card>
          )}

        </div>
      </main>

      {/* Modals */}
      {showLogoModal && logoResult && (
        <ImageModal src={logoResult.imageUrl} alt="Logo Fullscreen" onClose={() => setShowLogoModal(false)} />
      )}
    </div>
  );
};