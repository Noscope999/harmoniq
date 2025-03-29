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
  idealWeekend: text("ideal_weekend"),
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

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertTrend = z.infer<typeof insertTrendSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Questionnaire = typeof questionnaires.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Trend = typeof trends.$inferSelect;

// Login type
export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type LoginData = z.infer<typeof loginSchema>;

// VIT Email Validation
export const vitEmailSchema = z.string().email().endsWith("@vitstudent.ac.in");
