import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to auth page after a brief delay
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/5">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}