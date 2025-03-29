import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ChatMessage from "@/components/chat-message";

export default function ChatPage() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [, navigate] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch match details
  const { data: matches } = useQuery({
    queryKey: ["/api/matches"],
    enabled: !!user,
  });
  
  const match = matches?.find(m => m.id === parseInt(matchId));
  const otherUser = match?.otherUser;
  
  // Fetch messages
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/api/messages", matchId],
    enabled: !!matchId && !!user,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
  
  // Create message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!match || !otherUser) return;
      const messageData = {
        matchId: match.id,
        receiverId: otherUser.id,
        content
      };
      const res = await apiRequest("POST", "/api/messages", messageData);
      return await res.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", matchId] });
    }
  });
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle send button click
  const handleSend = () => {
    if (message.trim() && !sendMessage.isPending) {
      sendMessage.mutate(message);
    }
  };
  
  // Handle key press (send on Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // If no match is found, show error
  if (!isLoadingMessages && !match) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Match Not Found</h2>
          <p className="text-gray-600 mb-4">This conversation doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-3 px-4 flex items-center sticky top-0 z-10">
        <button 
          className="mr-3 focus:outline-none"
          onClick={() => navigate("/")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        
        {otherUser ? (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {otherUser.fullName.split(' ').map(name => name[0]).join('')}
              </span>
            </div>
            <div className="ml-2">
              <h2 className="font-bold text-sm">{otherUser.fullName}</h2>
              <p className="text-xs text-gray-200">
                {otherUser.program && otherUser.year ? 
                  `${programMapping[otherUser.program] || otherUser.program}, ${yearMapping[otherUser.year] || otherUser.year}` : 
                  "VIT Student"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="ml-2">
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-3 w-32 bg-gray-300 rounded animate-pulse mt-1"></div>
            </div>
          </div>
        )}
        
        <div className="ml-auto">
          <button 
            className="focus:outline-none"
            onClick={() => otherUser && navigate(`/profile/${otherUser.id}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {isLoadingMessages ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="mb-1">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isSent={message.senderId === user?.id}
                otherUser={otherUser}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 bg-white border-t">
        <div className="flex items-center">
          <Input
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus-visible:ring-primary"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button 
            className="ml-2 rounded-full w-10 h-10 p-0"
            onClick={handleSend}
            disabled={!message.trim() || sendMessage.isPending}
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Program and year mappings
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

const yearMapping: Record<string, string> = {
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
  "5": "5th Year"
};
