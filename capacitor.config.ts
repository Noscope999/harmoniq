// Define our own CapacitorConfig type since there seems to be a type mismatch
interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    androidScheme?: string;
    url?: string;
    cleartext?: boolean;
  };
  plugins?: Record<string, any>;
  android?: Record<string, any>;
}

const config: CapacitorConfig = {
  appId: 'com.harmoniq.app',
  appName: 'harmoniq',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development only - allow using the dev server
    // Comment this out for production builds
    url: 'http://localhost:3000',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#25c799",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
  },
  android: {
    allowMixedContent: true,
  }
};

export default config;