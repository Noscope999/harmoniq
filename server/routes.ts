import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertQuestionnaireSchema, insertMessageSchema, insertReportSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth routes
  setupAuth(app);

  // Questionnaire routes
  app.post("/api/questionnaire", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user!.id;
      const existingQuestionnaire = await storage.getQuestionnaire(userId);

      if (existingQuestionnaire) {
        return res.status(400).json({ message: "Questionnaire already exists for this user" });
      }

      const validatedData = insertQuestionnaireSchema.parse({
        ...req.body,
        userId
      });

      const questionnaire = await storage.createQuestionnaire(validatedData);
      res.status(201).json(questionnaire);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create questionnaire" });
    }
  });

  app.get("/api/questionnaire", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user!.id;
      const questionnaire = await storage.getQuestionnaire(userId);

      if (!questionnaire) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }

      res.status(200).json(questionnaire);
    } catch (error) {
      res.status(500).json({ message: "Failed to get questionnaire" });
    }
  });

  app.patch("/api/questionnaire", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user!.id;
      const existingQuestionnaire = await storage.getQuestionnaire(userId);

      if (!existingQuestionnaire) {
        return res.status(404).json({ message: "Questionnaire not found" });
      }

      const updatedQuestionnaire = await storage.updateQuestionnaire(userId, req.body);
      res.status(200).json(updatedQuestionnaire);
    } catch (error) {
      res.status(500).json({ message: "Failed to update questionnaire" });
    }
  });

  // Match routes
  app.get("/api/matches", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user!.id;
      const matches = await storage.getMatches(userId);

      // Enrich matches with user info
      const enrichedMatches = await Promise.all(matches.map(async (match) => {
        const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;
        const otherUser = await storage.getUser(otherUserId);
        
        if (!otherUser) {
          return null; // Skip if the other user doesn't exist
        }
        
        return {
          ...match,
          otherUser: {
            id: otherUser.id,
            fullName: otherUser.fullName,
            username: otherUser.username,
            program: otherUser.program,
            year: otherUser.year
          }
        };
      }));

      // Filter out nulls
      const validMatches = enrichedMatches.filter(match => match !== null);
      
      res.status(200).json(validMatches);
    } catch (error) {
      res.status(500).json({ message: "Failed to get matches" });
    }
  });

  // Message routes
  app.get("/api/messages/:matchId", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user!.id;
      const matchId = parseInt(req.params.matchId);
      
      if (isNaN(matchId)) {
        return res.status(400).json({ message: "Invalid match ID" });
      }
      
      const match = await storage.getMatch(matchId);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      // Verify the user is part of this match
      if (match.user1Id !== userId && match.user2Id !== userId) {
        return res.status(403).json({ message: "Unauthorized access to messages" });
      }
      
      const messages = await storage.getMessages(matchId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(matchId, userId);
      
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const senderId = req.user!.id;
      
      const schema = insertMessageSchema.extend({
        matchId: z.number(),
        receiverId: z.number()
      });
      
      const validatedData = schema.parse({
        ...req.body,
        senderId
      });
      
      const match = await storage.getMatch(validatedData.matchId);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      // Verify the sender is part of this match
      if (match.user1Id !== senderId && match.user2Id !== senderId) {
        return res.status(403).json({ message: "Unauthorized to send message" });
      }
      
      // Verify receiver is part of this match
      if (match.user1Id !== validatedData.receiverId && match.user2Id !== validatedData.receiverId) {
        return res.status(400).json({ message: "Receiver not part of this match" });
      }
      
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Report user route
  app.post("/api/reports", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const reporterId = req.user!.id;
      
      const validatedData = insertReportSchema.parse({
        ...req.body,
        reporterId
      });
      
      // Verify the reporter is not reporting themselves
      if (validatedData.reporterId === validatedData.reportedId) {
        return res.status(400).json({ message: "Cannot report yourself" });
      }
      
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to submit report" });
    }
  });

  // Events routes
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get events" });
    }
  });

  // Trends routes
  app.get("/api/trends", async (req: Request, res: Response) => {
    try {
      const trends = await storage.getTrends();
      res.status(200).json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trends" });
    }
  });
  
  // Popularity scores routes
  app.get("/api/popularity-scores", async (req: Request, res: Response) => {
    try {
      const entityType = req.query.type as string | undefined;
      const scores = await storage.getPopularityScores(entityType);
      res.status(200).json(scores);
    } catch (error) {
      console.error("Error fetching popularity scores:", error);
      res.status(500).json({ message: "Failed to fetch popularity scores" });
    }
  });
  
  // This specific route should be before the generic ID route to avoid conflicts
  app.get("/api/popularity-scores/entity/:type/:name", async (req: Request, res: Response) => {
    try {
      const { type, name } = req.params;
      
      const score = await storage.getPopularityScoreByEntity(name, type);
      if (!score) {
        return res.status(404).json({ message: "Popularity score not found" });
      }
      
      res.status(200).json(score);
    } catch (error) {
      console.error("Error fetching popularity score by entity:", error);
      res.status(500).json({ message: "Failed to fetch popularity score" });
    }
  });
  
  app.get("/api/popularity-scores/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const score = await storage.getPopularityScore(id);
      if (!score) {
        return res.status(404).json({ message: "Popularity score not found" });
      }
      
      res.status(200).json(score);
    } catch (error) {
      console.error("Error fetching popularity score:", error);
      res.status(500).json({ message: "Failed to fetch popularity score" });
    }
  });

  // Profile route
  app.get("/api/profile/:userId", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get the user's questionnaire for interest display
      const questionnaire = await storage.getQuestionnaire(userId);
      
      // Don't send sensitive information
      const profile = {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        program: user.program,
        year: user.year,
        interests: questionnaire ? {
          freeTime: questionnaire.freeTime,
          movieGenre: questionnaire.movieGenre,
          sports: questionnaire.sports,
          favoriteHobby: questionnaire.favoriteHobby,
          productiveTime: questionnaire.productiveTime,
          socialPreference: questionnaire.socialPreference,
          techUsage: questionnaire.techUsage
        } : null
      };
      
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  // Account deletion
  app.delete("/api/user", async (req: Request, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const userId = req.user!.id;
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Logout the user
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout after account deletion" });
        }
        res.status(200).json({ message: "Account deleted successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Schedule data cleanup (runs every 24 hours)
  setInterval(async () => {
    try {
      await storage.cleanupOldData();
      console.log("Data cleanup completed successfully");
    } catch (error) {
      console.error("Data cleanup failed:", error);
    }
  }, 24 * 60 * 60 * 1000);

  const httpServer = createServer(app);
  return httpServer;
}
