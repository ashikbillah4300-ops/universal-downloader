import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.downloader.app',
  appName: 'Downloader',
  webDir: 'out',
  server: {
    cleartext: true
  }
};

export default config;
