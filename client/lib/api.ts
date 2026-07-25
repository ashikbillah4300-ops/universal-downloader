import axios from "axios";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    const savedURL = localStorage.getItem("api_url");
    if (savedURL) return savedURL;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return "http://localhost:8000/api";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to update baseURL after initialization
export const updateApiBaseURL = (newURL: string) => {
  api.defaults.baseURL = newURL;
  if (typeof window !== "undefined") {
    localStorage.setItem("api_url", newURL);
  }
};
