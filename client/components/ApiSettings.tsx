"use client";

import { useState, useEffect } from "react";
import { Settings, Save, X, Activity, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, updateApiBaseURL } from "@/lib/api";
import axios from "axios";
import { Capacitor, CapacitorHttp, HttpResponse } from "@capacitor/core";

export function ApiSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    setUrl(api.defaults.baseURL || "");
    setTestStatus("idle");
    setTestMessage("");
  }, [isOpen]);

  const handleSave = () => {
    updateApiBaseURL(url);
    setIsOpen(false);
    window.location.reload(); // Reload to apply changes across all components
  };

  const testConnection = async () => {
    setTestStatus("testing");
    setTestMessage("Connecting...");

    try {
      // Direct call to health endpoint (ignoring base API interceptors if any)
      const baseUrl = url.endsWith("/api") ? url.replace(/\/api$/, "") : url;
      const healthUrl = baseUrl + "/health";

      let res;
      if (Capacitor.isNativePlatform()) {
        const response: HttpResponse = await CapacitorHttp.get({
          url: healthUrl,
          connectTimeout: 10000,
          readTimeout: 10000
        });
        res = { data: response.data, status: response.status };
      } else {
        const response = await axios.get(healthUrl, { timeout: 10000 });
        res = { data: response.data, status: response.status };
      }

      if (res.status === 200 && res.data.status === "ok") {
        setTestStatus("success");
        setTestMessage(`Connected! yt-dlp version: ${res.data.yt_dlp_version}`);
      } else {
        setTestStatus("error");
        setTestMessage(res.data.message || "Server responded with an error.");
      }
    } catch (err: any) {
      setTestStatus("error");
      if (err.code === "ERR_NETWORK") {
        setTestMessage("Network error. Make sure the URL is correct and the server is reachable.");
      } else {
        setTestMessage(err.response?.data?.message || err.message || "Failed to connect to server.");
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
        title="API Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  API Configuration
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Server API URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                       setUrl(e.target.value);
                       setTestStatus("idle");
                    }}
                    placeholder="http://192.168.1.5:8000/api"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                    If using a physical Android device, use your computer's IP address instead of 'localhost'.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={testConnection}
                    disabled={testStatus === "testing" || !url}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50"
                  >
                    {testStatus === "testing" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Activity className="w-4 h-4 text-accent" />
                    )}
                    Test Connection
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={testStatus === "testing"}
                    className="flex-1 bg-primary hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save & Reload
                  </button>
                </div>

                {testStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl border text-sm flex items-start gap-3 ${
                      testStatus === "success"
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : testStatus === "error"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    }`}
                  >
                    {testStatus === "success" ? (
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : testStatus === "error" ? (
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Activity className="w-4 h-4 mt-0.5 animate-pulse flex-shrink-0" />
                    )}
                    <span className="break-words">{testMessage}</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
