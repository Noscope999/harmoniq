import { Home, MessageSquare, Calendar, User } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BottomNavigationProps {
  active: "matches" | "messages" | "events" | "profile";
}

export default function BottomNavigation({ active }: BottomNavigationProps) {
  const [, navigate] = useLocation();
  
  return (
    <div className="bg-white border-t fixed bottom-0 left-0 right-0 flex justify-around py-2 z-10">
      <NavButton 
        icon={<Home className="h-5 w-5" />}
        label="Harmonies"
        isActive={active === "matches"}
        onClick={() => navigate("/")}
      />
      
      <NavButton 
        icon={<MessageSquare className="h-5 w-5" />}
        label="Messages"
        isActive={active === "messages"}
        onClick={() => {
          // For simplicity, in a real app this would show a list of chats
          // For now, if there are matches, go to the first match's chat
          navigate("/");
        }}
      />
      
      <NavButton 
        icon={<Calendar className="h-5 w-5" />}
        label="Events"
        isActive={active === "events"}
        onClick={() => navigate("/events")}
      />
      
      <NavButton 
        icon={<User className="h-5 w-5" />}
        label="Profile"
        isActive={active === "profile"}
        onClick={() => navigate("/profile/me")}
      />
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button 
      className="flex flex-col items-center py-1 px-3 relative"
      onClick={onClick}
    >
      <div className={`${isActive ? "text-primary" : "text-gray-500"}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${isActive ? "font-medium text-primary" : "text-gray-500"}`}>
        {label}
      </span>
      
      {isActive && (
        <div className="absolute -bottom-2 w-1/2 h-0.5 bg-primary rounded-full"></div>
      )}
    </button>
  );
}
