import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Calendar as CalendarIcon, User } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";

export default function EventsPage() {
  const { user } = useAuth();
  
  // Fetch events
  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events"],
    enabled: !!user,
  });
  
  // Format date function
  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="min-h-screen bg-light pb-16">
      {/* Header */}
      <div className="bg-primary text-white py-4 px-6 flex items-center sticky top-0 z-10">
        <div className="flex items-center">
          <div className="w-7 h-7 relative mr-2">
            {/* Two intersecting chat bubbles as logo */}
            <div className="absolute w-5 h-5 bg-white/80 rounded-full left-0"></div>
            <div className="absolute w-5 h-5 bg-white rounded-full right-0"></div>
          </div>
          <h1 className="text-xl font-bold">Campus Events</h1>
        </div>
      </div>
      
      <div className="container max-w-xl mx-auto p-6">
        <h2 className="text-lg font-bold mb-4">Upcoming Events</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !events || events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="flex justify-center mb-4">
              <CalendarIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
            <p className="text-gray-500">
              Check back later for upcoming events on campus.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event: any) => (
              <Card key={event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary bg-opacity-10 p-4 border-b border-primary border-opacity-20">
                    <h3 className="font-bold text-lg text-primary">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.organizer}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        <span>Organized by: {event.organizer}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation active="events" />
    </div>
  );
}
