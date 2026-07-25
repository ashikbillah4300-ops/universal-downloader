import axios from "axios";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { Capacitor } from "@capacitor/core";

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

// API object that uses Native HTTP on Android/iOS and Axios on Web
export const api = {
  get: async (url: string, config?: any) => {
    if (Capacitor.isNativePlatform()) {
      const response: HttpResponse = await CapacitorHttp.get({
        url: axiosInstance.defaults.baseURL + url,
        params: config?.params,
        headers: { ...axiosInstance.defaults.headers as any, ...config?.headers }
      });
      return { data: response.data, status: response.status };
    }
    return axiosInstance.get(url, config);
  },

  post: async (url: string, data?: any, config?: any) => {
    if (Capacitor.isNativePlatform()) {
      const response: HttpResponse = await CapacitorHttp.post({
        url: axiosInstance.defaults.baseURL + url,
        data: data,
        headers: {
          "Content-Type": "application/json",
          ...config?.headers
        },
        responseType: config?.responseType === 'blob' ? 'blob' : 'json'
      });

      // Axios-like response object
      return {
        data: response.data,
        status: response.status,
        headers: response.headers
      };
    }
    return axiosInstance.post(url, data, config);
  },

  delete: async (url: string, config?: any) => {
    if (Capacitor.isNativePlatform()) {
      const response: HttpResponse = await CapacitorHttp.delete({
        url: axiosInstance.defaults.baseURL + url,
        headers: config?.headers
      });
      return { data: response.data, status: response.status };
    }
    return axiosInstance.delete(url, config);
  },

  defaults: axiosInstance.defaults
};
