import React from 'react';
import { Button, Card } from '../components/ui/Elements';
import { AppView } from '../types';
import { ArrowRight, Zap, Globe, Layers, MessageCircle, BarChart, PenTool, CheckCircle, Play, Star, Box, Smartphone, Layout } from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-surface text-white overflow-hidden font-sans selection:bg-accent-violet/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">B</div>
            <span className="text-2xl font-display font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">BizForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
             <a href="#" className="hover:text-white transition-colors">Features</a>
             <a href="#" className="hover:text-white transition-colors">Pricing</a>
             <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center gap-4">
             <button className="hidden sm:block text-gray-300 hover:text-white font-medium text-sm">Log in</button>
             <Button onClick={() => onNavigate('dashboard')} variant="gradient" className="shadow-indigo-500/20">Launch App</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 px-6 z-10">
        <div className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 w-[min(100%,720px)] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.16)_0%,rgba(37,99,235,0.06)_45%,transparent_72%)] blur-3xl" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-sm text-gray-300 backdrop-blur-md">
            <SparkleIcon />
            <span>Introducing BizForge 2.0</span>
            <span className="text-accent-violet">✨</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              Build your brand
            </span>
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500">
              in seconds, not weeks.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Professional logos, marketing copy, and design systems — powered by Groq and logo-tuned SDXL.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)]"
            >
              Start building free
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-white/10 bg-white/[0.03] text-white text-sm font-medium backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
            >
              <Play size={16} className="mr-2 opacity-80" />
              Watch demo
            </button>
          </div>
          <p className="text-xs text-gray-500">No credit card required</p>

          {/* AI-Generated Brand Showcase Visual - Fixed Grid Alignment */}
          <div className="relative mt-24 animate-in fade-in zoom-in duration-1000 delay-500 w-full">
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-20 h-40 bottom-0 top-auto pointer-events-none"></div>
             
             <div className="max-w-6xl mx-auto space-y-6">
                {/* Row 1: 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Card 1: Logo */}
                   <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-500 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-900/40 flex items-center justify-center">
                         <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-400 to-cyan-400 shadow-lg shadow-cyan-500/30 animate-pulse-slow"></div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                         <div className="text-base font-bold text-white mb-1">AI-Generated Logo</div>
                         <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium"><SparkleIcon/> Vector Ready</div>
                      </div>
                   </div>

                   {/* Card 2: Website Mockup */}
                   <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-500 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-[#0f172a] p-4 flex flex-col">
                         <div className="w-full h-full bg-slate-900 rounded-xl border border-white/5 overflow-hidden flex flex-col relative">
                            <div className="h-6 border-b border-white/5 bg-slate-800 flex items-center gap-2 px-3 shrink-0">
                               <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                               <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                            </div>
                            <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 p-6 space-y-4">
                               <div className="flex items-center gap-4">
                                  <div className="h-8 w-8 bg-blue-500 rounded-lg"></div>
                                  <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                               </div>
                               <div className="h-32 w-full bg-white/5 rounded-lg border border-white/5"></div>
                               <div className="space-y-2">
                                  <div className="h-2 w-full bg-white/10 rounded-full"></div>
                                  <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                         <div className="text-base font-bold text-white mb-1">Website by BizForge AI</div>
                         <div className="flex items-center gap-1.5 text-xs text-blue-300 font-medium"><Layout size={14}/> Full Landing Page</div>
                      </div>
                   </div>

                   {/* Card 3: Social Media Pack */}
                   <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl hover:shadow-pink-500/20 hover:border-pink-500/50 transition-all duration-500 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-900/30 p-6 flex flex-col gap-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-500 shadow-lg shadow-pink-500/20"></div>
                            <div className="h-2.5 w-24 bg-white/20 rounded-full"></div>
                         </div>
                         <div className="flex-1 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12"></div>
                         </div>
                         <div className="space-y-2">
                            <div className="h-2 w-full bg-white/10 rounded-full"></div>
                            <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                         </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                         <div className="text-base font-bold text-white mb-1">Social Media Pack</div>
                         <div className="flex items-center gap-1.5 text-xs text-pink-300 font-medium"><Smartphone size={14}/> Instagram Ready</div>
                      </div>
                   </div>
                </div>

                {/* Row 2: 2 Cards Centered */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                   {/* Card 4: Brand Kit */}
                   <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all duration-500 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-[#0f172a] p-8 space-y-5">
                         <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Brand System</div>
                         <div className="space-y-3">
                            <div className="h-12 w-full bg-emerald-500/20 rounded-xl border border-emerald-500/30"></div>
                            <div className="h-12 w-full bg-emerald-900/20 rounded-xl border border-emerald-500/10"></div>
                            <div className="h-12 w-full bg-slate-800/50 rounded-xl border border-white/5"></div>
                         </div>
                         <div className="flex gap-3 pt-2">
                            <div className="h-10 w-10 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm">Aa</div>
                            <div className="h-10 w-10 rounded-full bg-emerald-500"></div>
                            <div className="h-10 w-10 rounded-full bg-slate-700"></div>
                         </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                         <div className="text-base font-bold text-white mb-1">Startup Brand Kit</div>
                         <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium"><Box size={14}/> Complete Assets</div>
                      </div>
                   </div>

                   {/* Card 5: Packaging */}
                   <div className="group relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-500 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 flex items-center justify-center relative overflow-hidden">
                         {/* Abstract Packaging shapes */}
                         <div className="w-32 h-44 bg-white/10 border border-white/20 rounded-xl transform -rotate-12 backdrop-blur-md shadow-2xl absolute left-16 top-10"></div>
                         <div className="w-32 h-44 bg-orange-500/20 border border-orange-500/30 rounded-xl transform rotate-6 absolute right-16 top-12 shadow-2xl backdrop-blur-md flex items-center justify-center">
                            <div className="w-16 h-16 border-2 border-orange-400 rounded-full opacity-80"></div>
                         </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                         <div className="text-base font-bold text-white mb-1">Packaging Design</div>
                         <div className="flex items-center gap-1.5 text-xs text-orange-300 font-medium"><Box size={14}/> Print Ready</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-5xl font-bold font-display">Supercharge your workflow</h2>
             <p className="text-xl text-gray-400 max-w-2xl mx-auto">A complete suite of tools powered by cutting-edge AI models to replace your entire agency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: PenTool, title: 'Brand Generator', desc: 'Generate unique, available business names with deep tone analysis and linguistic checks.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { icon: Layers, title: 'Logo Creator', desc: 'Create professional vector-style logos using Stable Diffusion XL with one click.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { icon: MessageCircle, title: 'Marketing Content', desc: 'Write emails, social posts, and ad copy with LLaMA 3.3 optimized for conversion.', color: 'text-green-400', bg: 'bg-green-500/10' },
              { icon: Globe, title: 'Design System', desc: 'Get AI-curated color palettes and typography pairings that match your vibe.', color: 'text-pink-400', bg: 'bg-pink-500/10' },
              { icon: BarChart, title: 'Sentiment Analysis', desc: 'Analyze customer feedback and rewrite for better tone instantly.', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { icon: Zap, title: 'AI Consultant', desc: 'Chat with our IBM Granite expert for real-time branding strategy.', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            ].map((f, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 transition-all duration-300 hover:border-accent-violet/30 hover:bg-white/[0.04] hover:shadow-glow-sm hover:-translate-y-0.5">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`${f.color} w-7 h-7`} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{f.desc}</p>
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                   <f.icon className="w-32 h-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-y border-white/[0.08] bg-surface-raised/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           {[
             { label: 'Brands Created', value: '10k+' },
             { label: 'Logos Generated', value: '50k+' },
             { label: 'Time Saved', value: '1000h+' },
             { label: 'User Rating', value: '4.9/5' }
           ].map((stat, i) => (
             <div key={i} className="space-y-2">
               <div className="text-4xl md:text-5xl font-bold text-white font-display">{stat.value}</div>
               <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
             <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
               Enterprise power.<br/>
               <span className="text-gray-500">Consumer simplicity.</span>
             </h2>
             <div className="space-y-6">
               {[
                 'Instant AI Automation: Save 100+ hours of manual work.',
                 'Multilingual Support: English, Spanish, French, German, Hindi.',
                 'Voice Input: Speak your ideas directly into the tools.',
                 'Professional Output: Export formatted text and images.'
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-4 group">
                   <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                     <CheckCircle size={14} className="text-emerald-400" />
                   </div>
                   <span className="text-lg text-gray-300 group-hover:text-white transition-colors">{item}</span>
                 </div>
               ))}
             </div>
             <Button variant="outline" className="h-12 px-8 rounded-full">Explore Features</Button>
           </div>
           
           <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-3xl opacity-20 transform rotate-6 animate-pulse-slow"></div>
             <div className="relative bg-[#0f172a] p-1 rounded-3xl border border-white/10 shadow-2xl">
                <div className="bg-[#1e293b]/50 rounded-[20px] p-8 border border-white/5">
                   {/* Abstract UI representation */}
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                         <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                      </div>
                      <div className="h-2 w-20 bg-gray-700 rounded-full"></div>
                   </div>
                   <div className="space-y-6">
                      <div className="flex gap-4">
                         <div className="w-16 h-16 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <Star fill="currentColor" />
                         </div>
                         <div className="space-y-3 flex-1">
                            <div className="h-4 w-1/3 bg-gray-600 rounded"></div>
                            <div className="h-3 w-full bg-gray-700 rounded"></div>
                            <div className="h-3 w-2/3 bg-gray-700 rounded"></div>
                         </div>
                      </div>
                      <div className="h-32 bg-white/5 rounded-xl border border-white/5 p-4 flex items-center justify-center">
                         <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-white">98%</div>
                            <div className="text-xs text-gray-500 uppercase">Match Score</div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
         <div className="max-w-5xl mx-auto glass-panel p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Ready to forge your brand?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join thousands of founders using BizForge to launch faster.</p>
            <Button size="lg" variant="gradient" onClick={() => onNavigate('dashboard')} className="shadow-2xl shadow-indigo-500/40">
               Get Started for Free <ArrowRight className="ml-2" />
            </Button>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-surface pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
             <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">B</div>
                 <span className="text-xl font-bold font-display">BizForge</span>
               </div>
               <p className="text-gray-500 text-sm">Automating creativity for the next generation of founders.</p>
             </div>
             <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-indigo-400">Features</a></li>
                   <li><a href="#" className="hover:text-indigo-400">Pricing</a></li>
                   <li><a href="#" className="hover:text-indigo-400">API</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-indigo-400">About</a></li>
                   <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
                   <li><a href="#" className="hover:text-indigo-400">Careers</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                   <li><a href="#" className="hover:text-indigo-400">Privacy</a></li>
                   <li><a href="#" className="hover:text-indigo-400">Terms</a></li>
                </ul>
             </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-gray-600 text-sm">
            <div>© 2025 BizForge. Powered by IBM Granite, Groq & SDXL.</div>
            <div className="flex gap-4 mt-4 md:mt-0">
               <Globe size={16} />
               <span>English (US)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400">
    <path d="M12 2L14.39 8.26L21 10.5L14.39 12.74L12 19L9.61 12.74L3 10.5L9.61 8.26L12 2Z" />
  </svg>
);