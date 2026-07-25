"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Music, FileVideo, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

type Status = "idle" | "uploading" | "converting" | "done" | "error";

export function FileConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setStatus("idle");
    setErrorMsg("");
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const handleConvert = async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(10);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("video", file);

      setProgress(30);
      setStatus("converting");

      const response = await api.post("/convert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(Math.min(90, 30 + (percent * 0.6))); // Map 0-100% upload to 30-90% overall progress
          }
        }
      });

      setProgress(95);

      // Trigger download
      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      a.href = url;
      a.download = `${baseName}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus("done");
    } catch (err: any) {
      console.error("Conversion error:", err);
      setStatus("error");
      if (err.code === "ERR_NETWORK" || !err.response) {
        setErrorMsg("Cannot connect to server. Please check your API settings in the Navbar.");
      } else {
        setErrorMsg(err.response?.data?.error || err.message || "Something went wrong");
      }
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isProcessing = status === "uploading" || status === "converting";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !file && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer
          ${isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-white/20 hover:border-primary/50 hover:bg-white/5"}
          ${file ? "cursor-default" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*,.mp4,.mkv,.avi,.mov,.webm,.flv,.wmv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Drop your video file here</p>
              <p className="text-gray-400 text-sm mt-1">or click to browse — MP4, MKV, AVI, MOV, WEBM (max 50MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <FileVideo className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-grow text-left min-w-0">
              <p className="text-white font-semibold truncate">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            {!isProcessing && (
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{status === "uploading" ? "Uploading..." : "Converting to MP3..."}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Messages */}
      {status === "done" && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-green-400 text-sm font-medium">Conversion complete! Your MP3 has been downloaded.</p>
          <button onClick={reset} className="ml-auto text-xs text-gray-400 hover:text-white transition-colors">Convert another</button>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{errorMsg}</p>
          <button onClick={reset} className="ml-auto text-xs text-gray-400 hover:text-white transition-colors">Try again</button>
        </div>
      )}

      {/* Convert Button */}
      {file && status !== "done" && (
        <button
          onClick={handleConvert}
          disabled={isProcessing}
          className="mt-5 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
        >
          {isProcessing ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> {status === "uploading" ? "Uploading..." : "Converting..."}</>
          ) : (
            <><Music className="w-5 h-5" /> Convert to MP3</>
          )}
        </button>
      )}
    </div>
  );
}
