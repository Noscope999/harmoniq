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
          <div className="w-12 h-12 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-primary font-bold">{getInitials(otherUser.fullName)}</span>
          </div>
          <div className="ml-3">
            <h3 className="font-bold">{otherUser.fullName}</h3>
            <p className="text-sm text-gray-500">
              {formattedProgram && formattedYear 
                ? `${formattedProgram}, ${formattedYear}` 
                : "VIT Student"}
            </p>
          </div>
          <div className="ml-auto bg-primary bg-opacity-10 text-primary font-bold rounded-full px-3 py-1 text-sm">
            {compatibilityScore}% Match
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
