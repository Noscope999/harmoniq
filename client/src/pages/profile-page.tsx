import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";
import InterestBadge from "@/components/interest-badge";

// Program mapping
const programMapping: Record<string, string> = {
  "cse": "Computer Science Engineering",
  "ece": "Electronics and Communication",
  "mech": "Mechanical Engineering",
  "civil": "Civil Engineering",
  "eee": "Electrical and Electronics",
  "biotech": "Biotechnology",
  "business": "Business Administration",
  "other": "Other Program"
};

// Year mapping
const yearMapping: Record<string, string> = {
  "1": "First Year",
  "2": "Second Year",
  "3": "Third Year",
  "4": "Fourth Year",
  "5": "Fifth Year"
};

// Free time options
const freeTimeMapping: Record<string, string> = {
  "reading": "Reading",
  "gaming": "Gaming",
  "sports": "Sports & Fitness",
  "movies": "Movies & TV Shows",
  "music": "Music"
};

// Productive time options
const productiveTimeMapping: Record<string, string> = {
  "morning": "Early Morning",
  "afternoon": "Afternoon",
  "evening": "Evening",
  "night": "Late Night"
};

// Movie genre options
const movieGenreMapping: Record<string, string> = {
  "action": "Action & Adventure",
  "comedy": "Comedy",
  "drama": "Drama",
  "scifi": "Sci-Fi & Fantasy",
  "horror": "Horror & Thriller"
};

// Social preference options
const socialPreferenceMapping: Record<string, string> = {
  "extrovert": "Very social, love being around people",
  "moderate": "Balanced, enjoy both social time and alone time",
  "introvert": "Prefer small groups or one-on-one interactions",
  "alone": "Generally prefer spending time alone"
};

// Tech usage options
const techUsageMapping: Record<string, string> = {
  "all_day": "All day, always connected",
  "frequently": "Frequently throughout the day",
  "occasionally": "Just occasionally when needed",
  "minimal": "Try to minimize screen time"
};

// Report form schema
const reportFormSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  description: z.string().min(10, "Please provide more details about the report"),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export default function ProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Determine if this is the current user's profile
  const isCurrentUser = userId === "me" || (user && parseInt(userId) === user.id);
  const targetUserId = isCurrentUser && user ? user.id : parseInt(userId);
  
  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: [`/api/profile/${targetUserId}`],
    enabled: !!targetUserId,
  });
  
  // Report form
  const reportForm = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      reason: "",
      description: "",
    },
  });
  
  // Report user mutation
  const reportMutation = useMutation({
    mutationFn: async (values: ReportFormValues) => {
      if (!user || !profile) return;
      
      const reportData = {
        reportedId: profile.id,
        reason: values.reason,
        description: values.description,
      };
      
      const res = await apiRequest("POST", "/api/reports", reportData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. We'll review it promptly.",
      });
      setIsReportDialogOpen(false);
      reportForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Report Failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/user");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      queryClient.setQueryData(["/api/user"], null);
      navigate("/auth");
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle report submission
  const onReportSubmit = (values: ReportFormValues) => {
    reportMutation.mutate(values);
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    deleteMutation.mutate();
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(name => name[0]).join('');
  };
  
  // Error screen if profile not found
  if (!isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center p-6">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-light pb-16">
      {/* Header */}
      <div className="bg-primary text-white py-4 px-6 flex items-center sticky top-0 z-10">
        <button 
          className="mr-3 focus:outline-none"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
        {isCurrentUser && (
          <div className="ml-auto">
            <button 
              className="focus:outline-none"
              onClick={() => navigate("/questionnaire")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="container max-w-xl mx-auto p-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : profile ? (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold text-2xl">{getInitials(profile.fullName)}</span>
              </div>
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <p className="text-gray-500">
                {profile.program && profile.year ? 
                  `${programMapping[profile.program] || profile.program}, ${yearMapping[profile.year] || profile.year}` : 
                  "VIT Student"}
              </p>
            </div>
            
            {profile.interests && (
              <>
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.freeTime && (
                        <InterestBadge label={freeTimeMapping[profile.interests.freeTime] || profile.interests.freeTime} />
                      )}
                      {profile.interests.movieGenre && (
                        <InterestBadge label={movieGenreMapping[profile.interests.movieGenre] || profile.interests.movieGenre} />
                      )}
                      {profile.interests.favoriteHobby && (
                        <InterestBadge label={profile.interests.favoriteHobby} />
                      )}
                      {profile.interests.sports && profile.interests.sports.map((sport: string, index: number) => (
                        <InterestBadge key={index} label={sport} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-3">Preferences</h3>
                    <div className="space-y-3">
                      {profile.interests.productiveTime && (
                        <div>
                          <p className="font-medium">Most Productive Time</p>
                          <p className="text-gray-700">
                            {productiveTimeMapping[profile.interests.productiveTime] || profile.interests.productiveTime}
                          </p>
                        </div>
                      )}
                      {profile.interests.socialPreference && (
                        <div>
                          <p className="font-medium">Social Preference</p>
                          <p className="text-gray-700">
                            {socialPreferenceMapping[profile.interests.socialPreference] || profile.interests.socialPreference}
                          </p>
                        </div>
                      )}
                      {profile.interests.techUsage && (
                        <div>
                          <p className="font-medium">Technology Usage</p>
                          <p className="text-gray-700">
                            {techUsageMapping[profile.interests.techUsage] || profile.interests.techUsage}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Report or Delete Button */}
            <div className="mt-6 mb-20">
              {isCurrentUser ? (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                    >
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete your account? This action cannot be undone.
                        All your personal data and matches will be permanently removed.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete Account"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                    >
                      Report User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report User</DialogTitle>
                      <DialogDescription>
                        Please provide details about why you're reporting this user.
                        Our moderation team will review your report.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...reportForm}>
                      <form onSubmit={reportForm.handleSubmit(onReportSubmit)} className="space-y-4">
                        <FormField
                          control={reportForm.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="reason">Reason for report</Label>
                              <FormControl>
                                <select
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  {...field}
                                >
                                  <option value="" disabled>Select a reason</option>
                                  <option value="inappropriate">Inappropriate content</option>
                                  <option value="harassment">Harassment</option>
                                  <option value="spam">Spam</option>
                                  <option value="fake">Fake profile</option>
                                  <option value="other">Other</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={reportForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="description">Description</Label>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide more details" 
                                  {...field} 
                                  rows={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setIsReportDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={reportMutation.isPending}
                          >
                            {reportMutation.isPending ? "Submitting..." : "Submit Report"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </>
        ) : null}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation active="profile" />
    </div>
  );
}
