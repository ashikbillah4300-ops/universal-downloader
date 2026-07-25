"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/history/${id}`);
      fetchHistory();
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all history?")) return;
    try {
      await api.delete("/history");
      setHistory([]);
    } catch (error) {
      alert("Failed to clear history");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-grow">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Download History</h1>
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-400 py-12 glass-card">
          No download history found.
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div key={item.id} className="glass-card p-4 flex flex-col md:flex-row items-center gap-6 group">
              <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-white/5 flex-shrink-0 relative">
                {item.thumbnail ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
                {item.duration && (
                   <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-xs">
                     {Math.floor(item.duration / 60)}:{('0' + (item.duration % 60)).slice(-2)}
                   </span>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-lg text-white mb-2 truncate" title={item.title}>
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs uppercase font-medium">
                    {item.format}
                  </span>
                  <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <ExternalLink className="w-3 h-3" /> Original URL
                  </a>
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'COMPLETED' ? 'text-green-400 bg-green-400/10' : item.status === 'FAILED' ? 'text-red-400 bg-red-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                title="Delete from history"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
