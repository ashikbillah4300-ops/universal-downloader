"use client";

import { useState } from "react";
import { AnalyzerForm } from "@/components/AnalyzerForm";
import { VideoDetails } from "@/components/VideoDetails";
import { FileConverter } from "@/components/FileConverter";
import { Music } from "lucide-react";

export default function Home() {
  const [videoData, setVideoData] = useState<any | null>(null);

  return (
    <div className="flex-grow flex flex-col items-center px-4">

      {/* ─── URL Downloader Section ─── */}
      <section className="w-full flex flex-col items-center py-20">
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary">
            Download Any Video, Anywhere.
          </h1>
          <p className="text-lg text-gray-400">
            Fast, free, and secure. Enter the URL of your favorite video to get started. Supports 1000+ sites including YouTube, Vimeo, and more.
          </p>
        </div>

        <AnalyzerForm
          onAnalyzeSuccess={(data) => setVideoData(data)}
        />

        {videoData && <VideoDetails data={videoData} />}
      </section>

      {/* ─── Divider ─── */}
      <div id="converter" className="w-full max-w-4xl flex items-center gap-6 py-4 scroll-mt-20">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400 text-sm font-medium">
          <Music className="w-4 h-4 text-primary" />
          Video to MP3 Converter
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* ─── File Converter Section ─── */}
      <section className="w-full flex flex-col items-center py-16">
        <div className="text-center max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Convert Video to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">MP3</span>
          </h2>
          <p className="text-gray-400">
            Upload any video from your device — MP4, MKV, AVI, MOV and more. We&apos;ll extract the audio and give you a clean MP3 instantly.
          </p>
        </div>

        <FileConverter />
      </section>

    </div>
  );
}
