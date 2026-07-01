import React, { useState, useEffect, FormEvent } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Download, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Laptop, 
  ShieldCheck, 
  Zap, 
  Play, 
  Smartphone, 
  ArrowRight, 
  Music, 
  Film, 
  Loader2, 
  Trash2, 
  Moon, 
  Sun,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { translations } from "./translations";

// Platform logo mapping (standard SVG / styling details matching the image)
const PLATFORMS = [
  { name: "YouTube", icon: "🔴", color: "bg-red-600/20 text-red-400 border-red-500/30" },
  { name: "Facebook", icon: "🔵", color: "bg-blue-600/20 text-blue-400 border-blue-500/30" },
  { name: "TikTok", icon: "⚫", color: "bg-neutral-800 text-teal-400 border-teal-500/30" },
  { name: "Instagram", icon: "📸", color: "bg-pink-600/20 text-pink-400 border-pink-500/30" },
  { name: "Twitter/X", icon: "🐦", color: "bg-sky-600/20 text-sky-400 border-sky-500/30" },
  { name: "Vimeo", icon: "🎬", color: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30" },
  { name: "Dailymotion", icon: "Ⓜ️", color: "bg-indigo-600/20 text-indigo-400 border-indigo-500/30" },
  { name: "SoundCloud", icon: "☁️", color: "bg-orange-600/20 text-orange-400 border-orange-500/30" },
];

interface RecentDownload {
  id: string;
  url: string;
  platform: string;
  title: string;
  timestamp: string;
  downloadUrl: string;
}

export default function App() {
  const [lang, setLang] = useState<"badini" | "sorani" | "english">("badini");
  const [langDropdown, setLangDropdown] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [quality, setQuality] = useState("max");
  const [audioOnly, setAudioOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);

  const t = translations[lang];
  const isRTL = lang !== "english";

  // Load history from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kurddownloader_recent");
      if (saved) {
        setRecentDownloads(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save history helper
  const saveRecent = (url: string, platform: string, title: string, downloadUrl: string) => {
    const newItem: RecentDownload = {
      id: Math.random().toString(36).substring(2, 9),
      url,
      platform,
      title: title || url.substring(0, 40) + "...",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      downloadUrl
    };
    const updated = [newItem, ...recentDownloads.slice(0, 9)];
    setRecentDownloads(updated);
    try {
      localStorage.setItem("kurddownloader_recent", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearHistory = () => {
    setRecentDownloads([]);
    try {
      localStorage.removeItem("kurddownloader_recent");
    } catch (e) {}
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: inputUrl,
          quality,
          audioOnly
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || t.downloadFailed);
      }

      setResult(data);
      
      // Save to recent list
      const platformName = data.platform || "Video";
      const titleName = data.text || `${platformName} Download`;
      if (data.url) {
        saveRecent(inputUrl, platformName, titleName, data.url);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.downloadFailed);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageLabel = (current: string) => {
    switch (current) {
      case "badini": return "کوردی بادینی";
      case "sorani": return "کوردی سۆرانی";
      case "english": return "English";
      default: return "کوردی بادینی";
    }
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
        theme === "dark" 
          ? "bg-[#030712] text-[#f3f4f6]" 
          : "bg-[#f3f4f6] text-[#1f2937]"
      }`} 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* BACKGROUND GLOWS */}
      {theme === "dark" && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-950/30 blur-[150px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[45%] h-[45%] rounded-full bg-blue-950/20 blur-[130px]" />
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className="relative z-10 border-b border-gray-800/20 backdrop-blur-md bg-opacity-70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Download className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white bg-clip-text">
              Kurd<span className="text-indigo-400">Downloader</span>
            </span>
          </div>

          {/* Center navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="hover:text-indigo-400 transition-colors">{t.home}</a>
            <a href="#howitworks" className="hover:text-indigo-400 transition-colors">{t.howItWorks}</a>
            <a href="#features" className="hover:text-indigo-400 transition-colors">{t.features}</a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-lg border border-gray-800/30 bg-gray-800/10 hover:bg-gray-800/20 text-gray-400 hover:text-white transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                <span>{getLanguageLabel(lang)}</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>

              <AnimatePresence>
                {langDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0b0f19] border border-gray-800 shadow-xl overflow-hidden z-50 text-right"
                  >
                    <button 
                      onClick={() => { setLang("badini"); setLangDropdown(false); }}
                      className={`w-full px-4 py-3 text-sm hover:bg-indigo-600/20 text-white block ${lang === "badini" ? "text-indigo-400 font-bold bg-indigo-900/10" : ""}`}
                    >
                      کوردی بادینی
                    </button>
                    <button 
                      onClick={() => { setLang("sorani"); setLangDropdown(false); }}
                      className={`w-full px-4 py-3 text-sm hover:bg-indigo-600/20 text-white block border-t border-gray-800/40 ${lang === "sorani" ? "text-indigo-400 font-bold bg-indigo-900/10" : ""}`}
                    >
                      کوردی سۆرانی
                    </button>
                    <button 
                      onClick={() => { setLang("english"); setLangDropdown(false); }}
                      className={`w-full px-4 py-3 text-sm hover:bg-indigo-600/20 text-white block border-t border-gray-800/40 ${lang === "english" ? "text-indigo-400 font-bold bg-indigo-900/10" : ""}`}
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text and search */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-right">
            
            {/* Title / Header with premium gradients */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-sans leading-tight tracking-tight">
                <span className="block text-white">{t.heroTitle1}</span>
                <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  {t.heroTitle2}
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t.heroSubtitle}
              </p>
            </motion.div>

            {/* Downloader Form Card (3D hover details) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-10 p-1 rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-blue-500/30 shadow-2xl"
            >
              <div className="p-4 sm:p-6 rounded-[14px] bg-[#0b0f19] border border-gray-800/50">
                <form onSubmit={handleDownload} className="flex flex-col gap-4">
                  
                  {/* Search input field with floating style */}
                  <div className="relative flex items-center">
                    <input 
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder={t.placeholder}
                      className="w-full pl-4 pr-12 py-4 bg-gray-900/60 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-500 text-base transition-all"
                      required
                    />
                    <div className="absolute right-4 text-gray-500">
                      <Download className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>

                  {/* Advanced Settings Row (Quality & Audio) */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-t border-gray-800/30">
                    
                    {/* Quality selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">{t.selectQuality}:</span>
                      <select 
                        value={quality} 
                        onChange={(e) => setQuality(e.target.value)}
                        className="bg-gray-900 border border-gray-800 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                        disabled={audioOnly}
                      >
                        <option value="max">{t.originalVideo} (1080p / Max)</option>
                        <option value="1080">1080p Full HD</option>
                        <option value="720">720p HD</option>
                        <option value="480">480p SD</option>
                      </select>
                    </div>

                    {/* Audio only toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={audioOnly}
                        onChange={(e) => setAudioOnly(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 bg-gray-900 border-gray-800 rounded focus:ring-indigo-500 focus:ring-offset-gray-900"
                      />
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-indigo-400" />
                        {t.onlyAudio}
                      </span>
                    </label>

                  </div>

                  {/* Submit Download button */}
                  <button
                    type="submit"
                    disabled={loading || !inputUrl}
                    className="w-full py-4 px-6 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t.downloading}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>{t.downloadBtn}</span>
                      </>
                    )}
                  </button>

                </form>

                {/* Response / Result Status Area */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="mt-6 p-5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-indigo-300"
                    >
                      <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        <h4 className="font-bold text-white text-sm">{t.videoFound}</h4>
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full capitalize">
                          {result.platform}
                        </span>
                      </div>

                      {result.text && (
                        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                          {result.text}
                        </p>
                      )}

                      {/* Display direct stream/redirect result */}
                      {result.url && (
                        <a 
                          href={result.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{t.openVideo}</span>
                        </a>
                      )}

                      {/* TikTok Image picker galleries */}
                      {result.picker && result.picker.length > 0 && (
                        <div className="space-y-3 mt-3">
                          <p className="text-xs text-gray-400 font-semibold mb-2">
                            {t.allPlatforms} Gallery Items ({result.picker.length}):
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-gray-900/50 rounded-lg">
                            {result.picker.map((item: any, idx: number) => (
                              <a 
                                key={idx}
                                href={item.url || item.thumb}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-gray-800 hover:bg-indigo-950 rounded border border-gray-700/50 text-center text-xs block text-white truncate transition-all"
                              >
                                {item.type === "photo" ? "📸 Photo" : "🎥 Video"} {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>

            {/* Safety badge below input */}
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-2 text-xs text-gray-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t.safetyText}</span>
            </div>

          </div>

          {/* Glowing 3D Laptop Hero Asset on Right */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="absolute w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[80px] z-0 animate-pulse" />
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative z-10 w-full max-w-[460px] perspective-1000"
            >
              <div className="preserve-3d rotate-y-12 transition-all hover:rotate-0 duration-700">
                <img 
                  src="/src/assets/images/hero_laptop_3d_1782926148156.jpg" 
                  alt="3D KurdDownloader Laptop Mockup"
                  className="rounded-2xl shadow-2xl border border-indigo-500/20 neon-glow"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* PLATFORMS GRID SECTION */}
      <section className="relative z-10 py-12 border-t border-gray-800/10 bg-gray-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-sm font-semibold tracking-wider text-indigo-400 uppercase">
              {t.supportedPlatforms}
            </h3>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {PLATFORMS.map((platform) => (
                <div 
                  key={platform.name}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border bg-[#0b0f19]/80 backdrop-blur-md ${platform.color} hover:scale-105 duration-300`}
                >
                  <span className="text-2xl mb-1">{platform.icon}</span>
                  <span className="text-xs font-semibold text-white">{platform.name}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
              ... {t.more}
            </p>
          </div>
        </div>
      </section>

      {/* RECENT DOWNLOADS LOG / HISTORY DASHBOARD */}
      {recentDownloads.length > 0 && (
        <section className="relative z-10 py-12 border-t border-gray-800/10 bg-gray-950/30">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-400" />
                <span>دابەزێنراوەکانی دوایی (Recent History)</span>
              </h3>
              <button 
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکی بکەوە</span>
              </button>
            </div>

            <div className="space-y-3">
              {recentDownloads.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0b0f19] border border-gray-800/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-indigo-600/10 flex items-center justify-center text-lg">
                      {item.platform.includes("youtube") ? "🔴" : "🎥"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {item.timestamp} • {item.platform}
                      </p>
                    </div>
                  </div>

                  <a 
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-20 border-t border-gray-800/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-white">{t.ourFeatures}</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">{t.feature1Title}</h4>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{t.feature1Desc}</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl hover:border-violet-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center mb-5 group-hover:bg-violet-600 group-hover:text-white transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">{t.feature2Title}</h4>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{t.feature2Desc}</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Film className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">{t.feature3Title}</h4>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{t.feature3Desc}</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl hover:border-teal-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-600/10 text-teal-400 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <Laptop className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">{t.feature4Title}</h4>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">{t.feature4Desc}</p>
            </div>

          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="howitworks" className="relative z-10 py-20 border-t border-gray-800/10 bg-gray-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-white">{t.howItWorksTitle}</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Connector Line in background on desktop */}
            <div className="hidden lg:block absolute top-[40px] left-8 right-8 h-[2px] bg-gradient-to-r from-indigo-500/10 via-purple-500/20 to-blue-500/10 z-0" />

            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl text-center relative z-10">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-sm mb-4">
                ١
              </span>
              <h4 className="text-base font-bold text-white mt-2">{t.step1Title}</h4>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">{t.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl text-center relative z-10">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-violet-600/20 text-violet-400 font-bold text-sm mb-4">
                ٢
              </span>
              <h4 className="text-base font-bold text-white mt-2">{t.step2Title}</h4>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">{t.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl text-center relative z-10">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 font-bold text-sm mb-4">
                ٣
              </span>
              <h4 className="text-base font-bold text-white mt-2">{t.step3Title}</h4>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">{t.step3Desc}</p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-gray-800/60 shadow-xl text-center relative z-10">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-teal-600/20 text-teal-400 font-bold text-sm mb-4">
                ٤
              </span>
              <h4 className="text-base font-bold text-white mt-2">{t.step4Title}</h4>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">{t.step4Desc}</p>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-gray-800/20 bg-[#060a12] py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} KurdDownloader. هەمی ماف پاراستینە.</p>
          <div className="flex gap-6">
            <a href="#home" className="hover:text-indigo-400 transition-all">{t.home}</a>
            <a href="#howitworks" className="hover:text-indigo-400 transition-all">{t.howItWorks}</a>
            <a href="#features" className="hover:text-indigo-400 transition-all">{t.features}</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
