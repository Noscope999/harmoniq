import { format } from "date-fns";

interface ChatMessageProps {
  message: {
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    createdAt: string;
    read: boolean;
  };
  isSent: boolean;
  otherUser?: {
    id: number;
    fullName: string;
    username: string;
  };
}

export default function ChatMessage({ message, isSent, otherUser }: ChatMessageProps) {
  // Format timestamp
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "h:mm a");
    } catch (e) {
      return "";
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(name => name[0]).join('');
  };
  
  return (
    <div className={`flex flex-col ${isSent ? 'items-end' : 'mb-4'}`}>
      {!isSent && (
        <div className="flex items-end gap-2">
          <div className="w-6 h-6 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mb-1">
            <span className="text-primary font-bold text-xs">
              {otherUser ? getInitials(otherUser.fullName) : '?'}
            </span>
          </div>
          <div className="chat-bubble-received bg-white py-2 px-3 max-w-[75%] rounded-lg shadow-sm">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs text-gray-400 text-right mt-1">{formatTime(message.createdAt)}</p>
          </div>
        </div>
      )}
      
      {isSent && (
        <div className="chat-bubble-sent bg-primary text-white py-2 px-3 max-w-[75%] rounded-lg shadow-sm">
          <p className="text-sm">{message.content}</p>
          <p className="text-xs text-gray-200 text-right mt-1">{formatTime(message.createdAt)}</p>
        </div>
      )}
    </div>
  );
}
