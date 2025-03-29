import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SplashScreen } from '@capacitor/splash-screen';

// Check if we're running on a native platform or in a web browser
export const isNativePlatform = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();

// Toast plugin implementation
export const showToast = async (message: string, duration: 'short' | 'long' = 'short') => {
  if (isNativePlatform()) {
    await Toast.show({
      text: message,
      duration: duration
    });
    return true;
  }
  return false;
};

// Camera plugin implementation
export const takePicture = async () => {
  if (isNativePlatform()) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      
      return image;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  }
  return null;
};

// Splash screen handling
export const hideSplashScreen = async () => {
  if (isNativePlatform()) {
    await SplashScreen.hide();
  }
};

// Initialize all Capacitor plugins and functionality
export const initializeCapacitor = () => {
  if (!isNativePlatform()) {
    console.log('Running in web environment');
    return;
  }
  
  console.log(`Running on ${getPlatform()} platform`);
  
  // Auto-hide splash screen after timeout
  setTimeout(() => {
    hideSplashScreen().catch(err => console.error('Error hiding splash screen:', err));
  }, 2000);
};

// Example of how to handle back button behavior (Android)
export const setupBackButtonHandler = () => {
  if (isNativePlatform() && getPlatform() === 'android') {
    document.addEventListener('backButton', (ev: Event) => {
      // Custom back button behavior goes here
      console.log('Back button pressed');
      
      // Prevent default behavior
      // ev.preventDefault();
    });
  }
};