#!/bin/bash

# Build the React application
echo "Building React application..."
npm run build

# Initialize Android if it doesn't exist
if [ ! -d "android" ]; then
    echo "Initializing Android platform..."
    npx cap init "harmoniq" "com.harmoniq.app" --web-dir=dist
    npx cap add android
fi

# Copy the web assets to the Android project
echo "Copying web assets to Android project..."
npx cap copy android

# Sync the Capacitor plugins with Android
echo "Syncing Capacitor plugins with Android..."
npx cap sync android

# Open Android Studio (optional, comment out if not needed)
# echo "Opening Android Studio..."
# npx cap open android

echo "Android build process completed!"
echo "You can now open Android Studio to build and run the application:"
echo "npx cap open android"