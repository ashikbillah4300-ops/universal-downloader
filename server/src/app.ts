import express from "express";
import cors from "cors";
import helmet from "helmet";
import apiRoutes from "./routes/api";
import { exec } from "child_process";
import path from "path";

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier local testing
}));
app.use(cors());
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Routes
app.use("/api", apiRoutes);

// Health check with tool verification
app.get("/health", (req, res) => {
  const ytDlpPath = process.platform === 'win32'
    ? path.join(process.cwd(), "yt-dlp.exe")
    : "yt-dlp";

  exec(`"${ytDlpPath}" --version`, (error, stdout) => {
    if (error) {
      return res.status(500).json({
        status: "error",
        message: "Server is up but video tool (yt-dlp) is not found or failing.",
        error: error.message
      });
    }
    res.status(200).json({
      status: "ok",
      yt_dlp_version: stdout.trim()
    });
  });
});

export default app;
