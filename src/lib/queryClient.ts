import { QueryClient } from "@tanstack/react-query";
import { mockService } from "./mockData";

// Mock query function that uses our mock service
const getMockQueryFn = (queryKey: string[]) => {
  const endpoint = queryKey[0];

  switch (endpoint) {
    case '/api/user':
      return mockService.getCurrentUser();
    case '/api/courses':
      return mockService.getCourses();
    case '/api/investments':
      return mockService.getInvestments();
    default:
      if (endpoint.startsWith('/api/course/')) {
        const id = parseInt(endpoint.split('/').pop() || '0');
        return mockService.getCourse(id);
      }
      return null;
  }
};

// Mock mutation functions
export const mockMutations = {
  login: async (credentials: { username: string; password: string }) => {
    return mockService.login(credentials.username, credentials.password);
  },
  register: async (userData: any) => {
    return mockService.register(userData);
  },
  logout: async () => {
    return mockService.logout();
  },
  createInvestment: async (investment: any) => {
    return mockService.createInvestment(investment);
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: ({ queryKey }) => getMockQueryFn(queryKey as string[]),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});