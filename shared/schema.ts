import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  program: text("program"),
  year: text("year"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Questionnaire answers schema
export const questionnaires = pgTable("questionnaires", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  
  // Connection type preference (new)
  connectionType: text("connection_type"),  // "casual_hangouts" or "roommates"
  
  // VIT-Specific and Activity-Based Questions (Objective)
  activeClub: text("active_club"),
  memorableEvent: text("memorable_event"),
  campusHangoutSpot: text("campus_hangout_spot"),
  techParticipation: text("tech_participation"),
  culturalPerformance: text("cultural_performance"),
  freeTimePreference: text("free_time_preference"),
  workshopsAttended: text("workshops_attended"),
  sportsActivities: text("sports_activities").array(),
  volunteerWork: text("volunteer_work"),
  languages: text("languages").array(),
  
  // Niche Interests and Activities (Subjective)
  idealWeekend: text("ideal_weekend"),
  freeDayActivity: text("free_day_activity"),
  hiddenTalents: text("hidden_talents"),
  uniqueEventIdea: text("unique_event_idea"),
  unusualHobbies: text("unusual_hobbies"),
  musicPreferences: text("music_preferences"),
  readingMaterial: text("reading_material"),
  creativeExpression: text("creative_expression"),
  favoriteArtForm: text("favorite_art_form"),
  outdoorAdventures: text("outdoor_adventures"),
  
  // Additional Questions (Niche Interests)
  games: text("games"),
  quirkyKnowledge: text("quirky_knowledge"),
  collaborationInterest: text("collaboration_interest"),
  vitMemes: text("vit_memes"),
  skillToLearn: text("skill_to_learn"),
  
  // Roommate-specific fields (new)
  // Objective Roommate Questions
  sleepSchedule: text("sleep_schedule"),
  tidiness: text("tidiness"),
  dietaryPreferences: text("dietary_preferences"),
  cookingFrequency: text("cooking_frequency"),
  sharingComfort: text("sharing_comfort"),
  guestFrequency: text("guest_frequency"),
  noisePreference: text("noise_preference"),
  choresSplitting: text("chores_splitting"),
  petAllergies: text("pet_allergies"),
  
  // Subjective Roommate Questions
  roommateBreakers: text("roommate_breakers"),
  conflictHandling: text("conflict_handling"),
  musicBehavior: text("music_behavior"),
  weekendRoutine: text("weekend_routine"),
  personalSpaceDefinition: text("personal_space_definition"),
  communicationStyle: text("communication_style"),
  roommateHobbies: text("roommate_hobbies").array(),
  personalityTrait: text("personality_trait"),
  idealRoommate: text("ideal_roommate"),
  studyWorkHabits: text("study_work_habits"),
  additionalRoommateInfo: text("additional_roommate_info"),
  
  // Legacy fields (kept for backward compatibility)
  freeTime: text("free_time"),
  productiveTime: text("productive_time"),
  favoriteColor: text("favorite_color"),
  movieGenre: text("movie_genre"),
  musicGenre: text("music_genre"),
  favoriteArtist: text("favorite_artist"),
  favoriteBook: text("favorite_book"),
  favoriteHobby: text("favorite_hobby"),
  favoritePlace: text("favorite_place"),
  sports: text("sports").array(),
  foodPreference: text("food_preference"),
  travelPreference: text("travel_preference"),
  socialPreference: text("social_preference"),
  studyStyle: text("study_style"),
  personalityType: text("personality_type"),
  dreamsGoals: text("dreams_goals"),
  favoriteSubject: text("favorite_subject"),
  favoriteApp: text("favorite_app"),
  favoriteGame: text("favorite_game"),
  streamingServices: text("streaming_services").array(),
  podcastPreference: text("podcast_preference"),
  techUsage: text("tech_usage"),
  petPreference: text("pet_preference"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Matches schema
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull().references(() => users.id),
  user2Id: integer("user2_id").notNull().references(() => users.id),
  compatibilityScore: integer("compatibility_score").notNull(),
  matchedCategories: text("matched_categories").array(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull().references(() => matches.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").notNull().references(() => users.id),
  reportedId: integer("reported_id").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  organizer: text("organizer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Trends schema
export const trends = pgTable("trends", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  count: integer("count").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Popularity Scores schema
export const popularityScores = pgTable("popularity_scores", {
  id: serial("id").primaryKey(),
  entityName: text("entity_name").notNull(),  // Name of the artist, athlete, book, etc.
  entityType: text("entity_type").notNull(),  // Type: artist, athlete, book, hobby, etc.
  searchVolume: integer("search_volume").default(0),
  socialMediaPresence: integer("social_media_presence").default(0),
  recentActivity: integer("recent_activity").default(0),
  relevanceToVIT: integer("relevance_to_vit").default(0),
  totalScore: integer("total_score").notNull(), // Aggregate popularity score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export insert schemas and types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true, 
  createdAt: true
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaires).omit({
  id: true,
  createdAt: true
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true
});

export const insertTrendSchema = createInsertSchema(trends).omit({
  id: true,
  createdAt: true
});

export const insertPopularityScoreSchema = createInsertSchema(popularityScores).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertTrend = z.infer<typeof insertTrendSchema>;
export type InsertPopularityScore = z.infer<typeof insertPopularityScoreSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Questionnaire = typeof questionnaires.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Trend = typeof trends.$inferSelect;
export type PopularityScore = typeof popularityScores.$inferSelect;

// Login type
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;

// VIT Email Validation
export const vitEmailSchema = z.string().email().endsWith("@vitstudent.ac.in");
