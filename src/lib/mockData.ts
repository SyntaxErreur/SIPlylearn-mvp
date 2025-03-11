import { User, Course, Saving, InsertUser } from "./schema";
import dbData from "../data/db.json";

// Helper to manage localStorage
const storage = {
  get: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Initialize localStorage with mock data if empty
if (!storage.get('courses')) {
  storage.set('courses', dbData.courses);
}
if (!storage.get('Savings')) {
  storage.set('Savings', dbData.Savings);
}

export const mockService = {
  // Auth methods
  login: async (username: string, password: string): Promise<User> => {
    const users = storage.get<User[]>('users') || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    storage.set('currentUser', user);
    return user;
  },

  register: async (userData: InsertUser): Promise<User> => {
    const users = storage.get<User[]>('users') || [];

    if (users.some(u => u.username === userData.username)) {
      throw new Error("Username already exists");
    }

    if (users.some(u => u.email === userData.email)) {
      throw new Error("Email already exists");
    }

    const newUser: User = {
      ...userData,
      id: users.length + 1
    };

    storage.set('users', [...users, newUser]);
    storage.set('currentUser', newUser);
    return newUser;
  },

  logout: async () => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    return storage.get('currentUser');
  },

  // Courses - use db.json data directly
  getCourses: (): Course[] => {
    return dbData.courses;
  },

  getCourse: (id: number): Course | undefined => {
    return dbData.courses.find(c => c.id === id);
  },

  // Savings - use db.json data
  getSavings: (): Saving[] => {
    return dbData.Savings;
  },

  createSaving: (Saving: Omit<Saving, 'id'>): Saving => {
    const Savings = storage.get<Saving[]>('Savings') || [];
    const newSaving = {
      ...Saving,
      id: Savings.length + 1
    };
    storage.set('Savings', [...Savings, newSaving]);
    return newSaving;
  }
};