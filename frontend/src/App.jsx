import { useState } from 'react';
import ManualQuiz from './components/ManualQuiz';
import VoiceQuiz from './components/VoiceQuiz';

export default function App() {
  const [flowMode, setFlowMode] = useState(null); // 'manual' or 'voice'

  const handleQuizCompletion = (finalProfileData) => {
    console.log("Onboarding Complete! Data Captured:", finalProfileData);
    
    // Construct required seamless handoff redirect URL
    const baseUrl = "https://jackie-jeans.vercel.app/";
    const searchParams = `?utm_source=hackathon_onboarding&fit_profile=${encodeURIComponent(JSON.stringify(finalProfileData))}`;
    
    // Smooth transition
    window.location.href = baseUrl + searchParams;
  };

  return (
  <div className="min-h-screen w-full bg-[#0B0B0C] text-zinc-100 flex flex-col justify-between p-4 md:p-8 selection:bg-emerald-500 selection:text-black font-sans relative overflow-hidden">
    
    {/* Subtle Cyber Glow Background Gradients */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

    {/* Header / Brand Navigation */}
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 border-b border-zinc-800/60 z-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black tracking-tighter text-white uppercase m-0 leading-none">
          JACKIE <span className="text-emerald-400">JEANS</span>
        </h1>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Studio Onboarding v2.5</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800/80">
          ⚡ Hackathon Build
        </span>
      </div>
    </header>

    {/* Main Content Showcase Arena */}
    <main className="flex-1 w-full flex flex-col items-center justify-center py-12 z-10">
      {!flowMode ? (
        <div className="w-full max-w-xl bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-8 rounded-3xl shadow-2xl shadow-black/50 transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Engineered for the Perfect Fit</h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-sm mx-auto">
              Select an option below to construct your algorithmic denim sizing architecture.
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Manual Card Selection */}
            <button 
              onClick={() => setFlowMode('manual')}
              className="group w-full p-6 text-left border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 rounded-2xl transition-all duration-200 flex items-start gap-4 relative overflow-hidden"
            >
              <div className="p-3 bg-zinc-800 text-zinc-300 rounded-xl group-hover:bg-white group-hover:text-black transition-colors duration-200 text-xl">
                📱
              </div>
              <div className="flex flex-col pr-4">
                <span className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors duration-200">Manual Interface</span>
                <span className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Step-by-step custom form setup featuring responsive choice sliders and size multi-selection fields.
                </span>
              </div>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 font-bold">→</span>
            </button>

            {/* AI Voice Card Selection */}
            <button 
              onClick={() => setFlowMode('voice')}
              className="group w-full p-6 text-left border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 hover:from-zinc-900/90 hover:to-zinc-900/40 hover:border-emerald-500/40 rounded-2xl transition-all duration-200 flex items-start gap-4 relative overflow-hidden shadow-lg shadow-emerald-950/5"
            >
              <div className="p-3 bg-emerald-950/40 text-emerald-400 rounded-xl group-hover:bg-emerald-400 group-hover:text-black transition-colors duration-200 text-xl">
                🎙️
              </div>
              <div className="flex flex-col pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors duration-200">AI Voice Assistant</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider animate-pulse">Live</span>
                </div>
                <span className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Hands-free natural language parser. Speak naturally to map your sizing metrics instantly using Gemini.
                </span>
              </div>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200 font-bold">→</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center animate-fade-in">
          {/* Active Container wrapper matching both form factors cleanly */}
          <div className="w-full max-w-md transition-all duration-300">
            {flowMode === 'manual' ? (
              <ManualQuiz onComplete={handleQuizCompletion} />
            ) : (
              <VoiceQuiz onComplete={handleQuizCompletion} />
            )}
          </div>
          
          <button 
            onClick={() => setFlowMode(null)} 
            className="mt-8 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors duration-150 flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800/60"
          >
            ← Change Mode Selection
          </button>
        </div>
      )}
    </main>

    {/* Footer Meta Details */}
    <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between py-6 border-t border-zinc-800/40 text-zinc-600 text-[11px] font-medium z-10 gap-2">
      <p>© 2026 Jackie Jeans Luxury Fitment Protocol.</p>
      <div className="flex items-center gap-4">
        <span className="hover:text-zinc-400 cursor-help transition-colors">Security Enforced</span>
        <span className="text-zinc-800">•</span>
        <span className="hover:text-zinc-400 cursor-help transition-colors">Universal Audio Sandbox</span>
      </div>
    </footer>
  </div>
);
}