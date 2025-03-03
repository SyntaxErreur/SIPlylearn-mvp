import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertInvestmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/courses", async (_req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/courses/:domain", async (req, res) => {
    const courses = await storage.getCoursesByDomain(req.params.domain);
    res.json(courses);
  });

  app.get("/api/course/:id", async (req, res) => {
    const course = await storage.getCourse(parseInt(req.params.id));
    if (!course) {
      return res.status(404).send("Course not found");
    }
    res.json(course);
  });

  app.get("/api/investments", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const investments = await storage.getInvestments(req.user.id);
    res.json(investments);
  });

  app.post("/api/investments", async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    try {
      const investment = insertInvestmentSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const created = await storage.createInvestment(investment);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json(err.errors);
      }
      throw err;
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
