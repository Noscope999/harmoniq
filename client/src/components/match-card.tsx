import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { MessageSquare, User } from "lucide-react";

interface MatchCardProps {
  match: {
    id: number;
    user1Id: number;
    user2Id: number;
    compatibilityScore: number;
    matchedCategories: string[];
    status: string;
    otherUser: {
      id: number;
      fullName: string;
      username: string;
      program: string;
      year: string;
    };
  };
  currentUserId: number | undefined;
}

// Program mapping
const programMapping: Record<string, string> = {
  "cse": "Computer Science",
  "ece": "Electronics & Comm",
  "mech": "Mechanical",
  "civil": "Civil",
  "eee": "Electrical & Electronics",
  "biotech": "Biotechnology",
  "business": "Business Admin",
  "other": "Other Program"
};

// Year mapping
const yearMapping: Record<string, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
  "5": "5th Year"
};

export default function MatchCard({ match, currentUserId }: MatchCardProps) {
  const [, navigate] = useLocation();
  
  // Extract user's details
  const { otherUser, compatibilityScore, matchedCategories } = match;
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(name => name[0]).join('');
  };
  
  // Format program and year
  const formattedProgram = programMapping[otherUser.program] || otherUser.program;
  const formattedYear = yearMapping[otherUser.year] || otherUser.year;
  
  // View profile handler
  const handleViewProfile = () => {
    navigate(`/profile/${otherUser.id}`);
  };
  
  // Start chat handler
  const handleStartChat = () => {
    navigate(`/chat/${match.id}`);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 relative">
            {/* Two intersecting chat bubbles as logo with initials */}
            <div className="absolute w-10 h-10 bg-primary/30 rounded-full left-0 top-1"></div>
            <div className="absolute w-10 h-10 bg-primary/60 rounded-full right-0 top-1"></div>
            <div className="absolute w-7 h-7 bg-white rounded-full top-2.5 left-2.5 z-10 flex items-center justify-center">
              <span className="text-primary font-bold text-xs">{getInitials(otherUser.fullName)}</span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="font-bold">{otherUser.fullName}</h3>
            <p className="text-sm text-gray-500">
              {formattedProgram && formattedYear 
                ? `${formattedProgram}, ${formattedYear}` 
                : "VIT Student"}
            </p>
          </div>
          <div className="ml-auto text-sm font-semibold">
            <div className="flex items-center">
              <div className="relative w-10 h-10 mr-1">
                {/* Mini circular progress indicator */}
                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    className="stroke-primary/20"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18" cy="18" r="15"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeDasharray={`${(compatibilityScore / 100) * 94.2} 94.2`}
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-primary text-xs font-bold">{compatibilityScore}%</span>
                </div>
              </div>
              <span className="text-gray-600">Match</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="text-sm font-medium mb-2">Similar Interests</h4>
          <div className="flex flex-wrap gap-2">
            {matchedCategories && matchedCategories.length > 0 ? (
              matchedCategories.map((category, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-secondary bg-opacity-10 text-secondary hover:bg-secondary hover:bg-opacity-20 text-xs"
                >
                  {category}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">No common interests found</span>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline" 
            className="border-primary text-primary"
            onClick={handleViewProfile}
          >
            <User className="h-4 w-4 mr-1" /> View Profile
          </Button>
          <Button 
            onClick={handleStartChat}
            className="flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-1" /> Message
          </Button>
        </div>
      </div>
    </div>
  );
}
