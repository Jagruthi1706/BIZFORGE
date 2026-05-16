import React, { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, useEffect, useState } from 'react';
import { Loader2, Mic, X, Maximize2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, className = '', size = 'md', ...props 
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3.5 text-lg'
  };

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050816] active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 border border-transparent",
    gradient: "bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-purple hover:opacity-95 text-white shadow-lg shadow-accent-violet/30 border border-transparent",
    secondary: "bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 hover:border-white/20",
    outline: "border border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white bg-transparent",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {/* Ripple/Glow effect wrapper could go here */}
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full group">
      {label && <label className="text-sm font-medium text-gray-400 group-focus-within:text-indigo-400 transition-colors ml-1">{label}</label>}
      <div className="relative">
        <input 
          className={`w-full bg-[#0f172a]/50 border border-gray-700/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600 hover:border-gray-600 hover:bg-[#0f172a] ${className}`} 
          {...props} 
        />
        {/* Glow effect on focus */}
        <div className="absolute inset-0 rounded-xl bg-indigo-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
      </div>
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
};

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full group">
      {label && <label className="text-sm font-medium text-gray-400 group-focus-within:text-indigo-400 transition-colors ml-1">{label}</label>}
      <textarea 
        className={`w-full bg-[#0f172a]/50 border border-gray-700/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600 hover:border-gray-600 hover:bg-[#0f172a] min-h-[120px] ${className}`} 
        {...props} 
      />
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; hoverEffect?: boolean }> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`glass-panel rounded-2xl p-6 relative overflow-hidden ${hoverEffect ? 'glass-panel-hover' : ''} ${className}`}>
      {/* Subtle Gradient Blob Background */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  toggleListening: () => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isListening, toggleListening }) => {
  return (
    <div className="relative">
       {isListening && (
         <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
       )}
      <button
        onClick={toggleListening}
        className={`relative z-10 p-2.5 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
            : 'bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
        title="Voice Input"
      >
        <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, options: {label: string, value: string}[] }> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full group">
      {label && <label className="text-sm font-medium text-gray-400 group-focus-within:text-indigo-400 transition-colors ml-1">{label}</label>}
      <div className="relative">
        <select 
          className={`w-full appearance-none bg-[#0f172a]/50 border border-gray-700/50 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-gray-600 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};

// --- New Components for Premium Feel ---

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-white/5 rounded-lg ${className}`}></div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    neutral: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} inline-flex items-center gap-1`}>
      {children}
    </span>
  );
};

export const ImageModal: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] w-full p-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <img src={src} alt={alt} className="w-full h-full object-contain rounded-lg shadow-2xl border border-white/10" />
      </div>
    </div>
  );
};

// --- Additional Components for new modules ---

export const ProgressBar: React.FC<{ value: number; max?: number; color?: string; className?: string }> = ({ value, max = 100, color = 'bg-blue-500', className = '' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={`w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export const Tabs: React.FC<{ tabs: string[]; active: string; onChange: (t: string) => void }> = ({ tabs, active, onChange }) => {
  return (
    <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${active === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};