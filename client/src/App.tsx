import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import QuestionnairePage from "@/pages/questionnaire-page";
import ChatPage from "@/pages/chat-page";
import ProfilePage from "@/pages/profile-page";
import EventsPage from "@/pages/events-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { useEffect } from "react";
import { getPlatform, isNativePlatform } from "./lib/capacitor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/home" component={HomePage} />
      <ProtectedRoute path="/questionnaire" component={QuestionnairePage} />
      <ProtectedRoute path="/chat/:matchId" component={ChatPage} />
      <ProtectedRoute path="/profile/:userId" component={ProfilePage} />
      <ProtectedRoute path="/events" component={EventsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Add platform-specific class to the body for platform-specific styling
  useEffect(() => {
    if (isNativePlatform()) {
      const platform = getPlatform();
      document.body.classList.add(platform.toLowerCase());
      
      // Add meta viewport for mobile
      const existingViewport = document.querySelector('meta[name="viewport"]');
      if (!existingViewport) {
        const viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        document.head.appendChild(viewport);
      }
      
      // Add status bar meta for iOS
      if (platform.toLowerCase() === 'ios') {
        const statusBarMeta = document.createElement('meta');
        statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        statusBarMeta.setAttribute('content', 'black-translucent');
        document.head.appendChild(statusBarMeta);
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className={`app-container ${isNativePlatform() ? 'native-app' : 'web-app'}`}>
          <Router />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
