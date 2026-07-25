"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

interface AnalyzerFormProps {
  onAnalyzeSuccess: (data: any) => void;
}

export function AnalyzerForm({ onAnalyzeSuccess }: AnalyzerFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await api.post("/analyze", { url });
      onAnalyzeSuccess({ ...res.data, originalUrl: url });
    } catch (err: any) {
      if (err.code === "ERR_NETWORK" || !err.response) {
        setError(`Network Error: Cannot reach server. If you just deployed, wait 30 seconds and try again.`);
      } else {
        setError(err.response?.data?.error || err.message || "Failed to analyze video URL.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleAnalyze} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-cards rounded-2xl p-1.5 border border-white/10 shadow-2xl gap-1.5">
          <div className="pl-3 pr-1 text-gray-400 flex-shrink-0 hidden sm:block">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-3 px-3 sm:px-0 text-sm sm:text-base"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex-shrink-0 bg-primary hover:bg-blue-500 text-white px-4 sm:px-7 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
          </button>
        </div>
      </form>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-red-400 mt-4 text-center text-sm bg-red-400/10 py-2 px-4 rounded-lg border border-red-400/20 inline-block"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
