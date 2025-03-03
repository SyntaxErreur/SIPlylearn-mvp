import { User, Course, Investment, InsertUser, InsertCourse, InsertInvestment } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCourses(): Promise<Course[]>;
  getCoursesByDomain(domain: string): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  
  getInvestments(userId: number): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private investments: Map<number, Investment>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.investments = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Seed some courses
    const sampleCourses: InsertCourse[] = [
      {
        title: "Master in Finance (Zero to Hero)",
        description: "Comprehensive finance course covering fundamentals to advanced topics",
        domain: "Finance",
        thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800",
        progress: 43
      },
      {
        title: "Financial Literacy 101",
        description: "Essential financial concepts for beginners",
        domain: "Finance",
        thumbnail: "https://images.unsplash.com/photo-1579532536935-619928decd08?w=800",
        progress: 0
      },
      {
        title: "Full Stack Web Development",
        description: "Master modern web development with React, Node.js, and more",
        domain: "Tech",
        thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800",
        progress: 0
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Learn the basics of ML algorithms and data science",
        domain: "Tech",
        thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800",
        progress: 0
      },
      {
        title: "Cloud Computing with AWS",
        description: "Comprehensive guide to AWS services and cloud architecture",
        domain: "Tech",
        thumbnail: "https://images.unsplash.com/photo-1603696774712-ba3bc7aa7c83?w=800",
        progress: 0
      },
      {
        title: "Mobile App Development",
        description: "Build iOS and Android apps using React Native",
        domain: "Tech",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
        progress: 0
      }
    ];

    sampleCourses.forEach(course => {
      const id = this.currentId++;
      this.courses.set(id, { ...course, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesByDomain(domain: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      course => course.domain === domain
    );
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getInvestments(userId: number): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      inv => inv.userId === userId
    );
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const id = this.currentId++;
    const newInvestment: Investment = { ...investment, id };
    this.investments.set(id, newInvestment);
    return newInvestment;
  }
}

export const storage = new MemStorage();