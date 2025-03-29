import { Home, MessageSquare, Calendar, User } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BottomNavigationProps {
  active: "matches" | "messages" | "events" | "profile";
}

export default function BottomNavigation({ active }: BottomNavigationProps) {
  const [, navigate] = useLocation();
  
  return (
    <div className="bg-white border-t fixed bottom-0 left-0 right-0 flex justify-around py-2 z-10">
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === "matches" ? "text-primary" : "text-gray-500"}`}
        onClick={() => navigate("/")}
      >
        <Home className={`h-5 w-5 ${active === "matches" ? "text-primary" : "text-gray-500"}`} />
        <span className="text-xs mt-1">Matches</span>
      </button>
      
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === "messages" ? "text-primary" : "text-gray-500"}`}
        onClick={() => {
          // For simplicity, in a real app this would show a list of chats
          // For now, if there are matches, go to the first match's chat
          navigate("/");
        }}
      >
        <MessageSquare className={`h-5 w-5 ${active === "messages" ? "text-primary" : "text-gray-500"}`} />
        <span className="text-xs mt-1">Messages</span>
      </button>
      
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === "events" ? "text-primary" : "text-gray-500"}`}
        onClick={() => navigate("/events")}
      >
        <Calendar className={`h-5 w-5 ${active === "events" ? "text-primary" : "text-gray-500"}`} />
        <span className="text-xs mt-1">Events</span>
      </button>
      
      <button 
        className={`flex flex-col items-center py-1 px-3 ${active === "profile" ? "text-primary" : "text-gray-500"}`}
        onClick={() => navigate("/profile/me")}
      >
        <User className={`h-5 w-5 ${active === "profile" ? "text-primary" : "text-gray-500"}`} />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
}
