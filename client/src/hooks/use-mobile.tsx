import { useState, useEffect } from "react";
import { isNativePlatform } from "@/lib/capacitor";

/**
 * Hook to detect if the current device is a mobile device
 * Returns true for both native mobile apps and mobile web browsers
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in a Capacitor native app
    if (isNativePlatform()) {
      setIsMobile(true);
      return;
    }
    
    // For web browsers, check screen size and user agent
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}