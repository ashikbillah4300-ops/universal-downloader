import axios from "axios";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { Capacitor } from "@capacitor/core";

const DEFAULT_URL = "https://universal-downloader-api-w2fr.onrender.com/api";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    const savedURL = localStorage.getItem("api_url");
    if (savedURL) return savedURL;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return DEFAULT_URL;
};

// Internal axios instance for web/dev
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

export const updateApiBaseURL = (newURL: string) => {
  axiosInstance.defaults.baseURL = newURL;
  if (typeof window !== "undefined") {
    localStorage.setItem("api_url", newURL);
  }
};

// Helper to handle native responses and match Axios error behavior
const handleNativeResponse = (response: HttpResponse) => {
  if (response.status >= 200 && response.status < 300) {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  }

  // Throw error for non-2xx status to match Axios behavior
  const error = new Error(`Request failed with status ${response.status}`) as any;
  error.response = {
    data: response.data,
    status: response.status,
    headers: response.headers
  };
  throw error;
};

// API object that uses Native HTTP on Android/iOS and Axios on Web
export const api = {
  get: async (url: string, config?: any) => {
    if (Capacitor.isNativePlatform()) {
      const fullUrl = axiosInstance.defaults.baseURL?.endsWith('/')
        ? axiosInstance.defaults.baseURL + (url.startsWith('/') ? url.slice(1) : url)
        : axiosInstance.defaults.baseURL + (url.startsWith('/') ? url : '/' + url);

      const response: HttpResponse = await CapacitorHttp.get({
        url: fullUrl,
        params: config?.params,
        headers: { ...axiosInstance.defaults.headers as any, ...config?.headers }
      });
      return handleNativeResponse(response);
    }
    return axiosInstance.get(url, config);
  },

  post: async (url: string, data?: any, config?: any) => {
    if (Capacitor.isNativePlatform()) {
      const baseUrl = axiosInstance.defaults.baseURL || DEFAULT_URL;
      const fullUrl = baseUrl.endsWith('/')
        ? baseUrl + (url.startsWith('/') ? url.slice(1) : url)
        : baseUrl + (url.startsWith('/') ? url : '/' + url);

      const response: HttpResponse = await CapacitorHttp.post({
        url: fullUrl,
        data: data,
        headers: {
          "Content-Type": "application/json",
          ...config?.headers
        },
        responseType: config?.responseType === 'blob' ? 'blob' : 'json'
      });

      return handleNativeResponse(response);
    }
    return axiosInstance.post(url, data, config);
  },

  delete: async (url: string, config?: any) => {
    if (Capacitor.isNativePlatform()) {
      const fullUrl = axiosInstance.defaults.baseURL?.endsWith('/')
        ? axiosInstance.defaults.baseURL + (url.startsWith('/') ? url.slice(1) : url)
        : axiosInstance.defaults.baseURL + (url.startsWith('/') ? url : '/' + url);

      const response: HttpResponse = await CapacitorHttp.delete({
        url: fullUrl,
        headers: config?.headers
      });
      return handleNativeResponse(response);
    }
    return axiosInstance.delete(url, config);
  },

  defaults: axiosInstance.defaults
};
