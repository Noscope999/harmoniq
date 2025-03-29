import { users, type User, type InsertUser, type Questionnaire, type InsertQuestionnaire, type Match, type InsertMatch, type Message, type InsertMessage, type Report, type InsertReport, type Event, type InsertEvent, type Trend, type InsertTrend } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Questionnaire methods
  getQuestionnaire(userId: number): Promise<Questionnaire | undefined>;
  createQuestionnaire(questionnaire: InsertQuestionnaire): Promise<Questionnaire>;
  updateQuestionnaire(userId: number, questionnaire: Partial<Questionnaire>): Promise<Questionnaire | undefined>;
  
  // Match methods
  getMatches(userId: number): Promise<Match[]>;
  getMatch(id: number): Promise<Match | undefined>;
  getMatchByUsers(user1Id: number, user2Id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<Match>): Promise<Match | undefined>;
  
  // Message methods
  getMessages(matchId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(matchId: number, userId: number): Promise<boolean>;
  
  // Report methods
  createReport(report: InsertReport): Promise<Report>;
  getReports(): Promise<Report[]>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Trend methods
  getTrends(): Promise<Trend[]>;
  createTrend(trend: InsertTrend): Promise<Trend>;
  updateTrend(name: string): Promise<Trend | undefined>;
  
  // Process matching
  processMatching(userId: number): Promise<Match[]>;
  
  // Data retention
  cleanupOldData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questionnaires: Map<number, Questionnaire>;
  private matches: Map<number, Match>;
  private messages: Map<number, Message>;
  private reports: Map<number, Report>;
  private events: Map<number, Event>;
  private trends: Map<number, Trend>;
  
  sessionStore: session.SessionStore;
  currentId: {
    users: number;
    questionnaires: number;
    matches: number;
    messages: number;
    reports: number;
    events: number;
    trends: number;
  };

  constructor() {
    this.users = new Map();
    this.questionnaires = new Map();
    this.matches = new Map();
    this.messages = new Map();
    this.reports = new Map();
    this.events = new Map();
    this.trends = new Map();
    
    this.currentId = {
      users: 1,
      questionnaires: 1,
      matches: 1,
      messages: 1,
      reports: 1,
      events: 1,
      trends: 1
    };
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Add mock events
    this.createEvent({
      title: "TEDxVIT Conference",
      description: "Annual TEDx event featuring inspiring speakers from various fields.",
      location: "Anna Auditorium",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      organizer: "TEDxVIT Club"
    });
    
    this.createEvent({
      title: "Hackathon 2023",
      description: "24-hour coding competition with exciting prizes.",
      location: "Technology Tower",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      organizer: "Coding Club"
    });
    
    // Add mock trends
    this.createTrend({ name: "TEDxVIT", count: 43 });
    this.createTrend({ name: "Riviera2023", count: 38 });
    this.createTrend({ name: "HackathonClub", count: 25 });
    this.createTrend({ name: "CodingChallenge", count: 20 });
    this.createTrend({ name: "MusicSociety", count: 18 });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    // Also delete related data (questionnaires, matches, messages)
    if (!this.users.has(id)) return false;
    
    this.users.delete(id);
    
    // Delete questionnaire
    const userQuestionnaire = Array.from(this.questionnaires.values())
      .find(q => q.userId === id);
    if (userQuestionnaire) this.questionnaires.delete(userQuestionnaire.id);
    
    // Delete matches
    const userMatches = Array.from(this.matches.values())
      .filter(m => m.user1Id === id || m.user2Id === id);
    userMatches.forEach(match => {
      this.matches.delete(match.id);
      
      // Delete messages related to this match
      const matchMessages = Array.from(this.messages.values())
        .filter(msg => msg.matchId === match.id);
      matchMessages.forEach(msg => this.messages.delete(msg.id));
    });
    
    return true;
  }
  
  // Questionnaire methods
  async getQuestionnaire(userId: number): Promise<Questionnaire | undefined> {
    return Array.from(this.questionnaires.values()).find(
      (q) => q.userId === userId
    );
  }

  async createQuestionnaire(insertQuestionnaire: InsertQuestionnaire): Promise<Questionnaire> {
    const id = this.currentId.questionnaires++;
    const now = new Date();
    const questionnaire: Questionnaire = { ...insertQuestionnaire, id, createdAt: now };
    this.questionnaires.set(id, questionnaire);
    
    // Process matching for new user
    await this.processMatching(questionnaire.userId);
    
    return questionnaire;
  }

  async updateQuestionnaire(userId: number, questionnaireData: Partial<Questionnaire>): Promise<Questionnaire | undefined> {
    const questionnaire = Array.from(this.questionnaires.values()).find(
      (q) => q.userId === userId
    );
    
    if (!questionnaire) return undefined;
    
    const updatedQuestionnaire = { ...questionnaire, ...questionnaireData };
    this.questionnaires.set(questionnaire.id, updatedQuestionnaire);
    
    // Re-process matching
    await this.processMatching(userId);
    
    return updatedQuestionnaire;
  }
  
  // Match methods
  async getMatches(userId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      (match) => match.user1Id === userId || match.user2Id === userId
    );
  }

  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchByUsers(user1Id: number, user2Id: number): Promise<Match | undefined> {
    return Array.from(this.matches.values()).find(
      (match) => 
        (match.user1Id === user1Id && match.user2Id === user2Id) ||
        (match.user1Id === user2Id && match.user2Id === user1Id)
    );
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.currentId.matches++;
    const now = new Date();
    const match: Match = { ...insertMatch, id, createdAt: now };
    this.matches.set(id, match);
    return match;
  }

  async updateMatch(id: number, matchData: Partial<Match>): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, ...matchData };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }
  
  // Message methods
  async getMessages(matchId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId.messages++;
    const now = new Date();
    const message: Message = { ...insertMessage, id, createdAt: now };
    this.messages.set(id, message);
    return message;
  }

  async markMessagesAsRead(matchId: number, userId: number): Promise<boolean> {
    const matchMessages = Array.from(this.messages.values())
      .filter(msg => msg.matchId === matchId && msg.receiverId === userId);
    
    matchMessages.forEach(message => {
      const updatedMessage = { ...message, read: true };
      this.messages.set(message.id, updatedMessage);
    });
    
    return true;
  }
  
  // Report methods
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentId.reports++;
    const now = new Date();
    const report: Report = { ...insertReport, id, createdAt: now };
    this.reports.set(id, report);
    return report;
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentId.events++;
    const now = new Date();
    const event: Event = { ...insertEvent, id, createdAt: now };
    this.events.set(id, event);
    return event;
  }
  
  // Trend methods
  async getTrends(): Promise<Trend[]> {
    return Array.from(this.trends.values())
      .sort((a, b) => b.count - a.count);
  }

  async createTrend(insertTrend: InsertTrend): Promise<Trend> {
    const id = this.currentId.trends++;
    const now = new Date();
    const trend: Trend = { ...insertTrend, id, createdAt: now };
    this.trends.set(id, trend);
    return trend;
  }

  async updateTrend(name: string): Promise<Trend | undefined> {
    const trend = Array.from(this.trends.values()).find(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );
    
    if (trend) {
      const updatedTrend = { ...trend, count: trend.count + 1 };
      this.trends.set(trend.id, updatedTrend);
      return updatedTrend;
    } else {
      return await this.createTrend({ name, count: 1 });
    }
  }
  
  // Process matching
  async processMatching(userId: number): Promise<Match[]> {
    const userQuestionnaire = await this.getQuestionnaire(userId);
    if (!userQuestionnaire) return [];
    
    const otherQuestionnaires = Array.from(this.questionnaires.values())
      .filter(q => q.userId !== userId);
    
    const matches: Match[] = [];
    
    for (const otherQ of otherQuestionnaires) {
      // Calculate compatibility score and matching categories
      const { score, categories } = this.calculateCompatibility(userQuestionnaire, otherQ);
      
      // Only create match if score exceeds threshold (80%)
      if (score >= 80) {
        // Check if match already exists
        const existingMatch = await this.getMatchByUsers(userId, otherQ.userId);
        
        if (existingMatch) {
          // Update existing match
          const updatedMatch = await this.updateMatch(existingMatch.id, {
            compatibilityScore: score,
            matchedCategories: categories
          });
          if (updatedMatch) matches.push(updatedMatch);
        } else {
          // Create new match
          const newMatch = await this.createMatch({
            user1Id: userId,
            user2Id: otherQ.userId,
            compatibilityScore: score,
            matchedCategories: categories,
            status: "pending"
          });
          matches.push(newMatch);
        }
      }
    }
    
    return matches;
  }
  
  // Helper method to calculate compatibility between two users
  private calculateCompatibility(q1: Questionnaire, q2: Questionnaire): { score: number, categories: string[] } {
    const matchedCategories: string[] = [];
    let totalFields = 0;
    let matchingFields = 0;
    
    // Compare each field
    const fieldsToCompare: (keyof Questionnaire)[] = [
      'freeTime', 'productiveTime', 'favoriteColor', 'movieGenre', 'musicGenre',
      'favoriteHobby', 'foodPreference', 'travelPreference', 'socialPreference',
      'studyStyle', 'personalityType', 'idealWeekend', 'favoriteSubject',
      'favoriteApp', 'techUsage', 'petPreference'
    ];
    
    // Array fields
    const arrayFields: (keyof Questionnaire)[] = ['sports', 'streamingServices'];
    
    // Category mappings
    const categoryMap: Record<keyof Questionnaire, string> = {
      freeTime: 'Leisure',
      productiveTime: 'Work Habits',
      favoriteColor: 'Personal Preferences',
      movieGenre: 'Entertainment',
      musicGenre: 'Entertainment',
      favoriteArtist: 'Entertainment',
      favoriteBook: 'Entertainment',
      favoriteHobby: 'Hobbies',
      favoritePlace: 'Travel',
      sports: 'Sports',
      foodPreference: 'Lifestyle',
      travelPreference: 'Travel',
      socialPreference: 'Social Preferences',
      studyStyle: 'Academic',
      personalityType: 'Personality',
      dreamsGoals: 'Aspirations',
      idealWeekend: 'Lifestyle',
      favoriteSubject: 'Academic',
      favoriteApp: 'Technology',
      favoriteGame: 'Entertainment',
      streamingServices: 'Entertainment',
      podcastPreference: 'Entertainment',
      techUsage: 'Technology',
      petPreference: 'Lifestyle',
      userId: '',
      id: '',
      createdAt: ''
    };
    
    // Check regular fields
    for (const field of fieldsToCompare) {
      if (q1[field] && q2[field]) {
        totalFields++;
        if (q1[field] === q2[field]) {
          matchingFields++;
          const category = categoryMap[field];
          if (category && !matchedCategories.includes(category)) {
            matchedCategories.push(category);
          }
        }
      }
    }
    
    // Check array fields
    for (const field of arrayFields) {
      const array1 = q1[field];
      const array2 = q2[field];
      
      if (array1 && array2 && array1.length > 0 && array2.length > 0) {
        totalFields++;
        
        // Check for any common elements
        const commonItems = array1.filter(item => array2.includes(item));
        
        if (commonItems.length > 0) {
          matchingFields++;
          const category = categoryMap[field];
          if (category && !matchedCategories.includes(category)) {
            matchedCategories.push(category);
          }
        }
      }
    }
    
    // Calculate compatibility score (percentage)
    const score = totalFields > 0 ? Math.round((matchingFields / totalFields) * 100) : 0;
    
    return { score, categories: matchedCategories };
  }
  
  // Data retention - clean up data older than one week
  async cleanupOldData(): Promise<void> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Clean up old messages
    const messagesToDelete = Array.from(this.messages.values())
      .filter(message => message.createdAt < oneWeekAgo);
    
    messagesToDelete.forEach(message => {
      this.messages.delete(message.id);
    });
    
    // Clean up expired trends
    const trendsToDelete = Array.from(this.trends.values())
      .filter(trend => trend.createdAt < oneWeekAgo);
    
    trendsToDelete.forEach(trend => {
      this.trends.delete(trend.id);
    });
  }
}

export const storage = new MemStorage();
