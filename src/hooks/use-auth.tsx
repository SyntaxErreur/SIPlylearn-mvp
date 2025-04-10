import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  username: string;
  email: string;
  fullName: string;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  fullName: string;
};

type Profile = {
  id: string;
  email: string;
  full_name: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: any;
  logoutMutation: any;
  registerMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return profile;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "Please check your email and click the confirmation link to activate your account",
          );
        }
        throw error;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
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
      // Sign up the user using Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        },
      );

      if (signUpError) {
        console.error("Registration error:", signUpError);
        throw new Error(signUpError.message);
      }

      if (!authData?.user) {
        throw new Error("Registration failed - no user returned");
      }

      // Create a profile record without manually passing the ID.
      // The database should automatically assign the user's ID via its default value.
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          email: data.email,
          full_name: data.fullName,
          created_at: new Date().toISOString(),
        },
      ]);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw new Error("Failed to create user profile");
      }

      return {
        needsEmailConfirmation: !authData.user.confirmed_at,
        user: authData.user,
      };
    },
    onSuccess: (result) => {
      if (result.needsEmailConfirmation) {
        toast({
          title: "Check your email",
          description:
            "Please click the confirmation link to activate your account",
        });
        setLocation("/auth");
      } else {
        queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        toast({
          title: "Welcome to SIPlylearn!",
          description: "Your account has been created successfully",
        });
        setLocation("/");
      }
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
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
