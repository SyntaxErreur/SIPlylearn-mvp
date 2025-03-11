import { User, Course, Saving, InsertUser } from "./schema";

const STORAGE_KEYS = {
  SavingS: 'Savings',
  COURSES: 'courses',
  USERS: 'users',
  CURRENT_USER: 'currentUser'
};

// Helper to manage localStorage
const storage = {
  get: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch a custom event when storage is updated
    window.dispatchEvent(new Event('storage-updated'));
  }
};

// Initialize localStorage with empty Savings if not exists
if (!storage.get(STORAGE_KEYS.SavingS)) {
  storage.set(STORAGE_KEYS.SavingS, []);
}

export const storageService = {
  // Saving related methods
  getSavings: (): Saving[] => {
    return storage.get(STORAGE_KEYS.SavingS) || [];
  },

  createSaving: (Saving: Omit<Saving, 'id'>): Saving => {
    const Savings = storage.get<Saving[]>(STORAGE_KEYS.SavingS) || [];
    const newSaving = {
      ...Saving,
      id: Savings.length + 1
    };
    const updatedSavings = [...Savings, newSaving];
    storage.set(STORAGE_KEYS.SavingS, updatedSavings);

    // Also dispatch event directly for immediate updates
    window.dispatchEvent(new Event('storage-updated'));

    return newSaving;
  },

  // Calculate Saving metrics
  calculateSavingMetrics: () => {
    const Savings = storage.get<Saving[]>(STORAGE_KEYS.SavingS) || [];

    // If no Savings, return zero values
    if (!Savings || Savings.length === 0) {
      return {
        totalSavings: 0,
        totalReturns: 0,
        rosPercentage: "0.0"
      };
    }

    // Calculate total savings
    const totalSavings = Savings.reduce((sum, inv) => {
      if (inv.type === 'sip') {
        return sum + (Number(inv.amount) * 30 * inv.duration);
      }
      return sum + Number(inv.amount); // For one-time payments
    }, 0);

    // Calculate total returns
    const totalReturns = Savings.reduce((sum, inv) => {
      if (inv.type === 'sip') {
        const duration = inv.duration;
        const apy = duration <= 3 ? 0 :
                   duration <= 6 ? 0.02 :
                   duration <= 9 ? 0.04 : 0.08;
        return sum + (Number(inv.amount) * 30 * duration * (apy * (duration/12)));
      }
      return sum + (Number(inv.amount) * 0.01); // 1% return for one-time payments
    }, 0);

    const rosPercentage = totalSavings > 0 ? ((totalReturns/totalSavings) * 100).toFixed(1) : "0.0";

    return {
      totalSavings,
      totalReturns,
      rosPercentage
    };
  }
};