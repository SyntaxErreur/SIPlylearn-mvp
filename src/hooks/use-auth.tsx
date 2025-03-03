import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Define types for our user
type User = {
  id: number;
  username: string;
  email: string;
  fullName: string;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  email: string;
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

const LOCAL_STORAGE_KEY = 'siplylearn_user';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check localStorage for existing user data
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: () => {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      // Simulated login - in real app, this would be an API call
      // For demo, we'll just create a mock user
      const mockUser: User = {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        fullName: credentials.username,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return mockUser;
    },
    onSuccess: (user: User) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${user.username}`,
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Simulated registration - in real app, this would be an API call
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000),
        username: data.username,
        email: data.email,
        fullName: data.fullName,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return mockUser;
    },
    onSuccess: (user: User) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome to SIPlylearn!",
        description: "Your account has been created successfully",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}