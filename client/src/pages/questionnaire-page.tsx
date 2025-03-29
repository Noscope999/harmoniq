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
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight, Save, Check } from "lucide-react";

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
const questionnaireSchema = z.object({
  // Academic Info
  program: z.string().min(1, "Please select your program"),
  year: z.string().min(1, "Please select your year of study"),
  
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

type QuestionnaireData = z.infer<typeof questionnaireSchema>;

const SECTIONS = ["academic", "lifestyle", "entertainment", "subjective", "additional"];

export default function QuestionnairePage() {
  const [section, setSection] = useState(0);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<QuestionnaireData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      program: "",
      year: "",
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
    },
  });
  
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
      setSection(section - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const getFieldsForSection = (sectionIndex: number): (keyof QuestionnaireData)[] => {
    switch (SECTIONS[sectionIndex]) {
      case "academic":
        return ["program", "year"];
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
  };
  
  const getSectionTitle = (sectionIndex: number): string => {
    switch (SECTIONS[sectionIndex]) {
      case "academic":
        return "Academic Information";
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
          </form>
        </Form>
      </div>
    </div>
  );
}
