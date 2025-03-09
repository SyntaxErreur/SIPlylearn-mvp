import { User, Course, Investment, InsertUser } from "./schema";

const STORAGE_KEYS = {
  INVESTMENTS: 'investments',
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

// Initialize localStorage with empty investments if not exists
if (!storage.get(STORAGE_KEYS.INVESTMENTS)) {
  storage.set(STORAGE_KEYS.INVESTMENTS, []);
}

export const storageService = {
  // Investment related methods
  getInvestments: (): Investment[] => {
    return storage.get(STORAGE_KEYS.INVESTMENTS) || [];
  },

  createInvestment: (investment: Omit<Investment, 'id'>): Investment => {
    const investments = storage.get<Investment[]>(STORAGE_KEYS.INVESTMENTS) || [];
    const newInvestment = {
      ...investment,
      id: investments.length + 1
    };
    const updatedInvestments = [...investments, newInvestment];
    storage.set(STORAGE_KEYS.INVESTMENTS, updatedInvestments);

    // Also dispatch event directly for immediate updates
    window.dispatchEvent(new Event('storage-updated'));

    return newInvestment;
  },

  // Calculate investment metrics
  calculateInvestmentMetrics: () => {
    const investments = storage.get<Investment[]>(STORAGE_KEYS.INVESTMENTS) || [];

    // If no investments, return zero values
    if (!investments || investments.length === 0) {
      return {
        totalSavings: 0,
        totalReturns: 0,
        rosPercentage: "0.0"
      };
    }

    // Calculate total savings
    const totalSavings = investments.reduce((sum, inv) => {
      if (inv.type === 'sip') {
        return sum + (Number(inv.amount) * 30 * inv.duration);
      }
      return sum + Number(inv.amount); // For one-time payments
    }, 0);

    // Calculate total returns
    const totalReturns = investments.reduce((sum, inv) => {
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