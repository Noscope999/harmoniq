import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight, Save, Check, Home, Users } from "lucide-react";

// Program options
const programOptions = [
  { id: "cse", label: "Computer Science Engineering" },
  { id: "ece", label: "Electronics and Communication" },
  { id: "mech", label: "Mechanical Engineering" },
  { id: "civil", label: "Civil Engineering" },
  { id: "eee", label: "Electrical and Electronics" },
  { id: "biotech", label: "Biotechnology" },
  { id: "business", label: "Business Administration" },
  { id: "other", label: "Other" }
];

// Year options
const yearOptions = [
  { id: "1", label: "First Year" },
  { id: "2", label: "Second Year" },
  { id: "3", label: "Third Year" },
  { id: "4", label: "Fourth Year" },
  { id: "5", label: "Fifth Year" }
];

// Connection Type options
const connectionTypeOptions = [
  { id: "casual_hangouts", label: "Casual Hangouts", description: "Connect with people for casual meetups, study sessions, or campus events", icon: <Users className="h-8 w-8 mb-2" /> },
  { id: "roommates", label: "Roommates", description: "Find compatible roommates based on living habits and preferences", icon: <Home className="h-8 w-8 mb-2" /> }
];

// Roommate-specific options
// Sleep Schedule options
const sleepScheduleOptions = [
  { id: "early_bird", label: "Early Bird" },
  { id: "night_owl", label: "Night Owl" },
  { id: "flexible", label: "Flexible" }
];

// Tidiness options
const tidinessOptions = [
  { id: "very_tidy", label: "Very Tidy" },
  { id: "moderately_tidy", label: "Moderately Tidy" },
  { id: "messy", label: "Messy" }
];

// Dietary options
const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "non_vegetarian", label: "Non-vegetarian" },
  { id: "other", label: "Other" }
];

// Cooking Frequency options
const cookingFrequencyOptions = [
  { id: "daily", label: "Daily" },
  { id: "occasionally", label: "Occasionally" },
  { id: "rarely", label: "Rarely" }
];

// Sharing Comfort options
const sharingComfortOptions = [
  { id: "ok_with_it", label: "Okay with it" },
  { id: "only_certain_items", label: "Only certain items" },
  { id: "not_comfortable", label: "Not comfortable" }
];

// Guest Frequency options
const guestFrequencyOptions = [
  { id: "never", label: "Never" },
  { id: "occasionally", label: "Occasionally" },
  { id: "often", label: "Often" }
];

// Noise Preference options
const noisePreferenceOptions = [
  { id: "quiet", label: "Quiet" },
  { id: "moderate", label: "Moderate" },
  { id: "lively", label: "Lively" }
];

// Chores Splitting options
const choresSplittingOptions = [
  { id: "equally", label: "Equally" },
  { id: "based_on_preferences", label: "Based on personal preferences" },
  { id: "hire_help", label: "Hire help if needed" }
];

// Pet Allergies options
const petAllergiesOptions = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
  { id: "open_to_pets", label: "Open to pets" }
];

// Communication Style options
const communicationStyleOptions = [
  { id: "directly", label: "Directly" },
  { id: "indirectly", label: "Indirectly" },
  { id: "dont_mind", label: "Don't mind" }
];

// Personality Trait options
const personalityTraitOptions = [
  { id: "introverted", label: "Introverted" },
  { id: "extroverted", label: "Extroverted" },
  { id: "ambivert", label: "Ambivert" }
];

// Free time options
const freeTimeOptions = [
  { id: "reading", label: "Reading" },
  { id: "gaming", label: "Gaming" },
  { id: "sports", label: "Sports & Fitness" },
  { id: "movies", label: "Movies & TV Shows" },
  { id: "music", label: "Music" }
];

// Productive time options
const productiveTimeOptions = [
  { id: "morning", label: "Early Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
  { id: "night", label: "Late Night" }
];

// Movie genre options
const movieGenreOptions = [
  { id: "action", label: "Action & Adventure" },
  { id: "comedy", label: "Comedy" },
  { id: "drama", label: "Drama" },
  { id: "scifi", label: "Sci-Fi & Fantasy" },
  { id: "horror", label: "Horror & Thriller" }
];

// Sports options
const sportsOptions = [
  { id: "cricket", label: "Cricket" },
  { id: "football", label: "Football" },
  { id: "basketball", label: "Basketball" },
  { id: "tennis", label: "Tennis" },
  { id: "badminton", label: "Badminton" },
  { id: "volleyball", label: "Volleyball" },
  { id: "chess", label: "Chess" },
  { id: "none", label: "Not interested in sports" }
];

// Music genre options
const musicGenreOptions = [
  { id: "pop", label: "Pop" },
  { id: "rock", label: "Rock" },
  { id: "hiphop", label: "Hip Hop" },
  { id: "classical", label: "Classical" },
  { id: "jazz", label: "Jazz" },
  { id: "electronic", label: "Electronic" },
  { id: "folk", label: "Folk" },
  { id: "indie", label: "Indie" }
];

// Color options
const colorOptions = [
  { id: "red", label: "Red" },
  { id: "blue", label: "Blue" },
  { id: "green", label: "Green" },
  { id: "yellow", label: "Yellow" },
  { id: "purple", label: "Purple" },
  { id: "orange", label: "Orange" },
  { id: "black", label: "Black" },
  { id: "white", label: "White" }
];

// Social preference options
const socialPreferenceOptions = [
  { id: "extrovert", label: "Very social, love being around people" },
  { id: "moderate", label: "Balanced, enjoy both social time and alone time" },
  { id: "introvert", label: "Prefer small groups or one-on-one interactions" },
  { id: "alone", label: "Generally prefer spending time alone" }
];

// Food preference options
const foodPreferenceOptions = [
  { id: "veg", label: "Vegetarian" },
  { id: "nonveg", label: "Non-vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "anything", label: "Anything and everything" }
];

// Tech usage options
const techUsageOptions = [
  { id: "all_day", label: "All day, always connected" },
  { id: "frequently", label: "Frequently throughout the day" },
  { id: "occasionally", label: "Just occasionally when needed" },
  { id: "minimal", label: "Try to minimize screen time" }
];

// Streaming service options
const streamingServiceOptions = [
  { id: "netflix", label: "Netflix" },
  { id: "prime", label: "Amazon Prime" },
  { id: "hotstar", label: "Disney+ Hotstar" },
  { id: "youtube", label: "YouTube" },
  { id: "spotify", label: "Spotify" },
  { id: "apple", label: "Apple Music/TV" },
  { id: "none", label: "Don't use streaming services" }
];

// Validation schema
const baseQuestionnaireSchema = z.object({
  // Academic Info
  program: z.string().min(1, "Please select your program"),
  year: z.string().min(1, "Please select your year of study"),
  
  // Connection type
  connectionType: z.string().min(1, "Please select a connection type"),
});

// Schema extension for casual hangouts 
const casualHangoutsSchema = baseQuestionnaireSchema.extend({
  // Make sure connectionType is "casual_hangouts"
  connectionType: z.literal("casual_hangouts"),
  
  // Lifestyle Questions
  freeTime: z.string().min(1, "Please select an option"),
  productiveTime: z.string().min(1, "Please select an option"),
  favoriteColor: z.string().min(1, "Please select an option"),
  socialPreference: z.string().min(1, "Please select an option"),
  foodPreference: z.string().min(1, "Please select an option"),
  
  // Entertainment Questions
  movieGenre: z.string().min(1, "Please select an option"),
  musicGenre: z.string().min(1, "Please select an option"),
  sports: z.array(z.string()).min(1, "Please select at least one option"),
  streamingServices: z.array(z.string()).min(1, "Please select at least one option"),
  
  // Subjective Questions
  favoriteArtist: z.string().min(1, "Please provide an answer"),
  favoriteBook: z.string().min(1, "Please provide an answer"),
  favoriteHobby: z.string().min(1, "Please provide an answer"),
  favoritePlace: z.string().min(1, "Please provide an answer"),
  favoriteSubject: z.string().min(1, "Please provide an answer"),
  favoriteApp: z.string().min(1, "Please provide an answer"),
  favoriteGame: z.string().min(1, "Please provide an answer"),
  
  // Additional Questions
  personalityType: z.string().min(1, "Please provide an answer"),
  techUsage: z.string().min(1, "Please select an option"),
  petPreference: z.string().min(1, "Please provide an answer"),
  travelPreference: z.string().min(1, "Please provide an answer"),
  studyStyle: z.string().min(1, "Please provide an answer"),
  dreamsGoals: z.string().min(1, "Please provide an answer"),
  idealWeekend: z.string().min(1, "Please provide an answer"),
  podcastPreference: z.string().min(1, "Please provide an answer"),
});

// Schema extension for roommates
const roommatesSchema = baseQuestionnaireSchema.extend({
  // Make sure connectionType is "roommates"
  connectionType: z.literal("roommates"),
  
  // Objective Roommate Questions
  sleepSchedule: z.string().min(1, "Please select an option"),
  tidiness: z.string().min(1, "Please select an option"),
  dietaryPreferences: z.string().min(1, "Please select an option"),
  cookingFrequency: z.string().min(1, "Please select an option"),
  sharingComfort: z.string().min(1, "Please select an option"),
  guestFrequency: z.string().min(1, "Please select an option"),
  noisePreference: z.string().min(1, "Please select an option"),
  choresSplitting: z.string().min(1, "Please select an option"),
  petAllergies: z.string().min(1, "Please select an option"),
  
  // Subjective Roommate Questions
  roommateBreakers: z.string().min(1, "Please provide an answer"),
  conflictHandling: z.string().min(1, "Please provide an answer"),
  musicBehavior: z.string().min(1, "Please provide an answer"),
  weekendRoutine: z.string().min(1, "Please provide an answer"),
  personalSpaceDefinition: z.string().min(1, "Please provide an answer"),
  communicationStyle: z.string().min(1, "Please select an option"),
  roommateHobbies: z.array(z.string()).min(1, "Please list at least one hobby"),
  personalityTrait: z.string().min(1, "Please select an option"),
  idealRoommate: z.string().min(1, "Please provide an answer"),
  studyWorkHabits: z.string().min(1, "Please provide an answer"),
  additionalRoommateInfo: z.string().optional(),
});

// Combined schema using discriminated union
const questionnaireSchema = z.discriminatedUnion("connectionType", [
  casualHangoutsSchema,
  roommatesSchema
]);

type QuestionnaireData = z.infer<typeof questionnaireSchema>;
type CasualHangoutsData = z.infer<typeof casualHangoutsSchema>;
type RoommatesData = z.infer<typeof roommatesSchema>;

// Sections for casual hangouts flow
const CASUAL_SECTIONS = ["academic", "connection", "lifestyle", "entertainment", "subjective", "additional"];

// Sections for roommates flow
const ROOMMATE_SECTIONS = ["academic", "connection", "roommate_objective", "roommate_subjective"];

export default function QuestionnairePage() {
  const [section, setSection] = useState(0);
  const [connectionType, setConnectionType] = useState<"casual_hangouts" | "roommates" | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get current sections based on connection type selection
  const SECTIONS = connectionType === "roommates" 
    ? ROOMMATE_SECTIONS 
    : (connectionType === "casual_hangouts" ? CASUAL_SECTIONS : CASUAL_SECTIONS);
  
  const form = useForm<QuestionnaireData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      program: "",
      year: "",
      connectionType: connectionType || undefined,
      
      // Casual hangouts fields
      freeTime: "",
      productiveTime: "",
      favoriteColor: "",
      socialPreference: "",
      foodPreference: "",
      movieGenre: "",
      musicGenre: "",
      sports: [],
      streamingServices: [],
      favoriteArtist: "",
      favoriteBook: "",
      favoriteHobby: "",
      favoritePlace: "",
      favoriteSubject: "",
      favoriteApp: "",
      favoriteGame: "",
      personalityType: "",
      techUsage: "",
      petPreference: "",
      travelPreference: "",
      studyStyle: "",
      dreamsGoals: "",
      idealWeekend: "",
      podcastPreference: "",
      
      // Roommate fields
      sleepSchedule: "",
      tidiness: "",
      dietaryPreferences: "",
      cookingFrequency: "",
      sharingComfort: "",
      guestFrequency: "",
      noisePreference: "",
      choresSplitting: "",
      petAllergies: "",
      roommateBreakers: "",
      conflictHandling: "",
      musicBehavior: "",
      weekendRoutine: "",
      personalSpaceDefinition: "",
      communicationStyle: "",
      roommateHobbies: [],
      personalityTrait: "",
      idealRoommate: "",
      studyWorkHabits: "",
      additionalRoommateInfo: "",
    } as any,
  });
  
  // Handle connection type selection
  const handleConnectionTypeSelect = (type: "casual_hangouts" | "roommates") => {
    setConnectionType(type);
    form.setValue("connectionType", type);
    setSection(2); // Move to the next section after connection type selection
    window.scrollTo(0, 0);
  };
  
  const submitMutation = useMutation({
    mutationFn: async (data: QuestionnaireData) => {
      const response = await apiRequest("POST", "/api/questionnaire", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questionnaire"] });
      toast({
        title: "Profile complete!",
        description: "Your profile has been set up and we're finding matches for you.",
        variant: "default",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: QuestionnaireData) => {
    submitMutation.mutate(data);
  };
  
  const nextSection = () => {
    // Get fields for the current section
    const fieldsToValidate = getFieldsForSection(section);
    
    // Validate only those fields
    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        if (section < SECTIONS.length - 1) {
          setSection(section + 1);
          window.scrollTo(0, 0);
        } else {
          form.handleSubmit(onSubmit)();
        }
      }
    });
  };
  
  const prevSection = () => {
    if (section > 0) {
      // If we're going back from a connection-type-specific section to the connection type selection
      if (section === 2) {
        setConnectionType(null);
        form.setValue("connectionType", undefined as any);
      }
      
      setSection(section - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const navigateToLogin = () => {
    navigate("/");
  };
  
  const isLastSection = () => {
    return connectionType === "roommates" 
      ? section === ROOMMATE_SECTIONS.length - 1
      : section === CASUAL_SECTIONS.length - 1;
  };
  
  const getFieldsForSection = (sectionIndex: number): string[] => {
    if (connectionType === "roommates") {
      switch (ROOMMATE_SECTIONS[sectionIndex]) {
        case "academic":
          return ["program", "year"];
        case "connection":
          return ["connectionType"];
        case "roommate_objective":
          return ["sleepSchedule", "tidiness", "dietaryPreferences", "cookingFrequency", 
                  "sharingComfort", "guestFrequency", "noisePreference", "choresSplitting", "petAllergies"];
        case "roommate_subjective":
          return ["roommateBreakers", "conflictHandling", "musicBehavior", "weekendRoutine", 
                  "personalSpaceDefinition", "communicationStyle", "roommateHobbies", 
                  "personalityTrait", "idealRoommate", "studyWorkHabits", "additionalRoommateInfo"];
        default:
          return [];
      }
    } else {
      switch (CASUAL_SECTIONS[sectionIndex]) {
        case "academic":
          return ["program", "year"];
        case "connection":
          return ["connectionType"];
        case "lifestyle":
          return ["freeTime", "productiveTime", "favoriteColor", "socialPreference", "foodPreference"];
        case "entertainment":
          return ["movieGenre", "musicGenre", "sports", "streamingServices"];
        case "subjective":
          return ["favoriteArtist", "favoriteBook", "favoriteHobby", "favoritePlace"];
        case "additional":
          return ["favoriteSubject", "favoriteApp", "favoriteGame", "personalityType", "techUsage", 
                 "petPreference", "travelPreference", "studyStyle", "dreamsGoals", "idealWeekend", "podcastPreference"];
        default:
          return [];
      }
    }
  };
  
  const getSectionTitle = (sectionIndex: number): string => {
    if (connectionType === "roommates") {
      switch (ROOMMATE_SECTIONS[sectionIndex]) {
        case "academic":
          return "Academic Information";
        case "connection":
          return "Connection Type";
        case "roommate_objective":
          return "Living Habits";
        case "roommate_subjective":
          return "Roommate Preferences";
        default:
          return "";
      }
    } else {
      switch (CASUAL_SECTIONS[sectionIndex]) {
        case "academic":
          return "Academic Information";
        case "connection":
          return "Connection Type";
        case "lifestyle":
          return "Lifestyle & Habits";
        case "entertainment":
          return "Entertainment Preferences";
        case "subjective":
          return "About You";
        case "additional":
          return "Additional Preferences";
        default:
          return "";
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-primary text-white py-4 px-6 flex items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold">Profile Setup</h1>
        <div className="ml-auto text-sm">{section + 1}/{SECTIONS.length}</div>
      </div>
      
      <div className="container max-w-xl mx-auto p-6 pb-24">
        <h2 className="text-xl font-bold mb-6">{getSectionTitle(section)}</h2>
        
        <Form {...form}>
          <form className="space-y-6">
            {/* Connection Type Selection */}
            {section === 1 && (
              <div className="grid grid-cols-1 gap-6">
                <h3 className="text-lg font-semibold">What are you looking for at VIT?</h3>
                <p className="text-muted-foreground mb-4">
                  Choose what type of connections you're interested in making
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {connectionTypeOptions.map((option) => (
                    <Card 
                      key={option.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        connectionType === option.id ? 'border-2 border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => handleConnectionTypeSelect(option.id as "casual_hangouts" | "roommates")}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        {option.icon}
                        <h3 className="font-bold text-lg">{option.label}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Roommate Objective Questions */}
            {section === 2 && connectionType === "roommates" && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="sleepSchedule"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>What is your usual sleep schedule?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your sleep schedule" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sleepScheduleOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tidiness"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>How tidy do you keep your living space?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your tidiness preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tidinessOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dietaryPreferences"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Do you have any dietary restrictions or preferences?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your dietary preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dietaryOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cookingFrequency"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>How often do you cook at home?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your cooking frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cookingFrequencyOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sharingComfort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How comfortable are you with sharing personal belongings?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your sharing comfort level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sharingComfortOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="guestFrequency"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>How frequently do you have guests over?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your guest frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {guestFrequencyOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="noisePreference"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Do you prefer a quiet or lively environment at home?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your noise preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {noisePreferenceOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="choresSplitting"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>How do you prefer to split household chores?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your chores preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {choresSplittingOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="petAllergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you have any pet allergies or aversions to pets?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your pet preference" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {petAllergiesOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Roommate Subjective Questions */}
            {section === 3 && connectionType === "roommates" && (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="roommateBreakers"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>What are your top three deal-breakers in a roommate?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Example: smoking indoors, loud music after 11pm, etc."
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="conflictHandling"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>How do you handle conflicts or disagreements?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your approach to resolving conflicts"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="musicBehavior"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What kind of music do you usually listen to, and do you play it out loud?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your music preferences and listening habits"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="weekendRoutine"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Describe your ideal weekend routine</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How do you typically spend your weekends?"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="personalSpaceDefinition"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>What is your definition of personal space in a shared room?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe how you view personal boundaries in shared living"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="communicationStyle"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>How do you prefer to communicate about household responsibilities?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your communication style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {communicationStyleOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="roommateHobbies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What are your hobbies and interests?</FormLabel>
                          <FormDescription>Select all that apply</FormDescription>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {sportsOptions.map((option) => (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      let updatedValue = [...(field.value || [])];
                                      if (checked) {
                                        updatedValue.push(option.id);
                                      } else {
                                        updatedValue = updatedValue.filter((val) => val !== option.id);
                                      }
                                      field.onChange(updatedValue);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                              </FormItem>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="personalityTrait"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Are you more introverted, extroverted, or ambivert?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your personality trait" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {personalityTraitOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="idealRoommate"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>What does a perfect roommate look like to you?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your ideal roommate"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="studyWorkHabits"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Do you have any particular study/work habits a roommate should be aware of?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Example: I study late at night, I need absolute silence when studying, etc."
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalRoommateInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Is there anything else you'd like to mention that might affect compatibility?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional information you'd like potential roommates to know"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Academic Info Section */}
            {section === 0 && (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="program"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>Program/Major</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your program" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {programOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Study</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {yearOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Lifestyle Section */}
            {section === 1 && (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="freeTime"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What's your favorite way to spend free time?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {freeTimeOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="productiveTime"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What time of day are you most productive?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {productiveTimeOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoriteColor"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What's your favorite color?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {colorOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="socialPreference"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>How would you describe your social preference?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {socialPreferenceOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="foodPreference"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What are your food preferences?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {foodPreferenceOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Entertainment Section */}
            {section === 2 && (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="movieGenre"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What's your favorite movie genre?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {movieGenreOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="musicGenre"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>What's your favorite music genre?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {musicGenreOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="sports"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              What sports do you follow? (Select all that apply)
                            </FormLabel>
                            <FormDescription>
                              Select at least one option
                            </FormDescription>
                          </div>
                          {sportsOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="sports"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="streamingServices"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              What streaming services do you use? (Select all that apply)
                            </FormLabel>
                            <FormDescription>
                              Select at least one option
                            </FormDescription>
                          </div>
                          {streamingServiceOptions.map((option) => (
                            <FormField
                              key={option.id}
                              control={form.control}
                              name="streamingServices"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={option.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(option.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, option.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== option.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Subjective Section */}
            {section === 3 && (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoriteArtist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Who's your favorite musical artist?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoriteBook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's the best book you've read recently?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoriteHobby"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your favorite hobby?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoritePlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your favorite place on campus?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Additional Section */}
            {section === 4 && (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoriteSubject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your favorite subject?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoriteApp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your most used app?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="favoriteGame"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your favorite game (video or board game)?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="personalityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How would you describe your personality in a few words?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="techUsage"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>How would you describe your technology usage?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-1"
                            >
                              {techUsageOptions.map((option) => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="petPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Are you a cat person, dog person, or something else?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="travelPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your ideal vacation destination?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="studyStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How do you prefer to study?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="dreamsGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's one of your biggest dreams or goals?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="idealWeekend"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What does your ideal weekend look like?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="podcastPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you listen to podcasts? If yes, which ones?</FormLabel>
                          <FormControl>
                            <Input placeholder="Type your answer here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between">
              {section > 0 ? (
                <Button variant="outline" type="button" onClick={prevSection}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              ) : (
                <Button variant="outline" type="button" onClick={() => navigate("/")}>
                  Save & Exit
                </Button>
              )}
              
              {section < SECTIONS.length - 1 ? (
                <Button type="button" onClick={nextSection}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? 
                    "Submitting..." : 
                    <>Complete <Check className="ml-2 h-4 w-4" /></>
                  }
                </Button>
              )}
            </div>
            {/* Navigation Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-between items-center">
              {section === 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={navigateToLogin}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevSection}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              
              {section === 1 && !connectionType ? (
                <Button type="button" disabled variant="default">
                  Select a Connection Type
                </Button>
              ) : isLastSection() ? (
                <Button
                  type="button"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  className="flex items-center"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? (
                    <>Saving...</>
                  ) : (
                    <>
                      Save <Save className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextSection}
                  className="flex items-center"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
