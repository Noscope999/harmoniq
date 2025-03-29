import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";
import MatchCard from "@/components/match-card";
import InterestBadge from "@/components/interest-badge";

export default function HomePage() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  
  // Fetch matches
  const { data: matches, isLoading: isLoadingMatches } = useQuery({
    queryKey: ["/api/matches"],
    enabled: !!user,
  });
  
  // Fetch trending topics
  const { data: trends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ["/api/trends"],
    enabled: !!user,
  });
  
  return (
    <div className="min-h-screen bg-light flex flex-col pb-16">
      {/* Header */}
      <div className="bg-primary text-white py-4 px-6 flex items-center sticky top-0 z-10">
        <div className="flex items-center">
          <div className="w-7 h-7 relative mr-2">
            {/* Two intersecting chat bubbles as logo */}
            <div className="absolute w-5 h-5 bg-white/80 rounded-full left-0"></div>
            <div className="absolute w-5 h-5 bg-white rounded-full right-0"></div>
          </div>
          <h1 className="text-xl font-bold">Harmonique</h1>
        </div>
        <div className="ml-auto flex space-x-4">
          <button 
            className="focus:outline-none"
            onClick={() => {
              // This would show notifications in a real app
              // For now just show a toast
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button 
            className="focus:outline-none"
            onClick={() => navigate("/profile/" + user?.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>

      {/* Trending Interests Section */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-3">Trending Harmonies</h2>
        {isLoadingTrends ? (
          <div className="flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : !trends || trends.length === 0 ? (
          <p className="text-sm text-gray-500">No trending topics at the moment.</p>
        ) : (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {trends.map((trend) => (
              <span 
                key={trend.id} 
                className="bg-gradient-to-r from-primary/10 to-primary/20 px-3 py-1 rounded-full text-sm shadow-sm whitespace-nowrap text-primary font-medium border border-primary/20"
              >
                #{trend.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Your Harmonies Section */}
      <div className="p-4 pb-20 flex-1">
        <h2 className="text-lg font-bold mb-3">Your Harmonies</h2>
        
        {isLoadingMatches ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !matches || matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 relative mb-4">
              {/* Two intersecting chat bubbles as logo with search icon */}
              <div className="absolute w-20 h-20 bg-primary/30 rounded-full left-0 top-2"></div>
              <div className="absolute w-20 h-20 bg-primary/40 rounded-full right-0 top-2"></div>
              <div className="absolute w-10 h-10 bg-white/90 rounded-full top-7 left-7 z-10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">Finding your harmony</h3>
            <p className="text-gray-500 text-center max-w-xs">
              We're searching for students whose uniqueness intersects with yours. Check back soon for new connections!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                currentUserId={user?.id} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation active="matches" />
    </div>
  );
}
