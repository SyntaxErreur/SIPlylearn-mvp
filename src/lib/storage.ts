import { User, Course, Investment, InsertUser } from "./schema";

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

// Initial mock courses data
const mockCourses: Course[] = [
  {
    id: 1,
    title: "Master in Finance (Zero to Hero)",
    description: "Comprehensive finance course covering fundamentals to advanced topics",
    domain: "Finance",
    thumbnail: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800",
    progress: 43
  },
  {
    id: 2,
    title: "Financial Literacy 101",
    description: "Essential financial concepts for beginners",
    domain: "Finance",
    thumbnail: "https://images.unsplash.com/photo-1579532536935-619928decd08?w=800",
    progress: 0
  },
  {
    id: 3,
    title: "Full Stack Web Development",
    description: "Master modern web development with React, Node.js, and more",
    domain: "Tech",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800",
    progress: 0
  }
];

// Initialize localStorage with mock data if empty
if (!storage.get('courses')) {
  storage.set('courses', mockCourses);
}

export const storageService = {
  // Auth
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

  // Courses
  getCourses: (): Course[] => {
    return storage.get('courses') || [];
  },

  getCourse: (id: number): Course | undefined => {
    const courses = storage.get<Course[]>('courses') || [];
    return courses.find(c => c.id === id);
  },

  // Investments
  getInvestments: (): Investment[] => {
    return storage.get('investments') || [];
  },

  createInvestment: (investment: Omit<Investment, 'id'>): Investment => {
    const investments = storage.get<Investment[]>('investments') || [];
    const newInvestment = {
      ...investment,
      id: investments.length + 1
    };
    storage.set('investments', [...investments, newInvestment]);
    return newInvestment;
  }
};
