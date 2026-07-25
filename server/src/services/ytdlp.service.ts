import { spawn, exec } from "child_process";
import { promisify } from "util";
import path from "path";
import ffmpegPath from "ffmpeg-static";

const execAsync = promisify(exec);

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  view_count: number;
  formats: any[];
}

// Ensure it points to our local yt-dlp.exe if on windows
const ytDlpPath = process.platform === 'win32' 
  ? path.join(process.cwd(), "yt-dlp.exe") 
  : "yt-dlp";

export const analyzeVideoUrl = async (url: string): Promise<VideoInfo> => {
  return new Promise((resolve, reject) => {
    const args = [
      "--dump-json",
      "--no-warnings",
      "--skip-download",
      "--no-check-certificate",
      "--prefer-free-formats",
      "--add-header", "Accept-Language:en-US,en;q=0.9",
      "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      url
    ];

    console.log(`Running: ${ytDlpPath} ${args.join(' ')}`);

    const child = spawn(ytDlpPath, args);
    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error("Video analysis timed out (30 seconds). The website might be slow or blocked."));
    }, 30000);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout) as VideoInfo);
        } catch (e) {
          reject(new Error("Failed to parse video information."));
        }
      } else {
        console.error(`yt-dlp failed with code ${code}. Stderr: ${stderr}`);
        if (stderr.includes("Unsupported URL")) {
          reject(new Error("This website is not supported yet."));
        } else if (stderr.includes("Private video")) {
          reject(new Error("This video is private and cannot be downloaded."));
        } else {
          reject(new Error("The video tool failed to read this link. It might be invalid or protected."));
        }
      }
    });

    child.on("error", (err) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to start video tool: ${err.message}`));
    });
  });
};

export const downloadToDisk = (url: string, format: string, filepath: string) => {
  const args = [
    url,
    "-f", format,
    "--merge-output-format", "mp4",
    "-o", filepath,
    "--no-warnings",
    "--quiet"
  ];

  if (ffmpegPath) {
    args.push("--ffmpeg-location", ffmpegPath);
  }
  
  return spawn(ytDlpPath, args);
};
