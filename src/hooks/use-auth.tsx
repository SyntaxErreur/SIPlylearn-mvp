import { createContext, ReactNode, useContext, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  username?: string;
  email: string;
  fullName: string;
  created_at?: string;
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
  loginMutation: ReturnType<typeof useMutation>;
  logoutMutation: ReturnType<typeof useMutation>;
  registerMutation: ReturnType<typeof useMutation>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Attempt to get initial cached user from localStorage (if available)
  const cachedUserData =
    typeof window !== "undefined" ? localStorage.getItem("user-data") : null;
  const initialUser = cachedUserData
    ? (JSON.parse(cachedUserData) as User)
    : null;

  // Rehydrate session on mount if we have tokens.
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("sb-access-token");
    const storedRefreshToken = localStorage.getItem("sb-refresh-token");
    if (storedAccessToken && storedRefreshToken) {
      supabase.auth
        .setSession({
          access_token: storedAccessToken,
          refresh_token: storedRefreshToken,
        })
        .catch((error) => {
          console.error("Failed to set session from localStorage", error);
          // Optionally clear invalid tokens
          localStorage.removeItem("sb-access-token");
          localStorage.removeItem("sb-refresh-token");
          localStorage.removeItem("user-data");
        });
    }
  }, []);

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

      // Optionally, you can also refetch extra profile data from your 'profiles' table.
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return profile;
    },
    // Use cached data from localStorage initially for a faster load.
    initialData: initialUser,
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

      // Save tokens to localStorage
      const accessToken = data.session?.access_token || "";
      const refreshToken = data.session?.refresh_token || "";
      localStorage.setItem("sb-access-token", accessToken);
      localStorage.setItem("sb-refresh-token", refreshToken);
      const userData = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata.full_name,
        created_at: data.user.created_at,
      };
      localStorage.setItem("user-data", JSON.stringify(userData));

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      return { ...profile, accessToken };
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
      // Sign up using Supabase Auth
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

      // Create a profile record.
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

      // Clear stored auth data from localStorage
      localStorage.removeItem("sb-access-token");
      localStorage.removeItem("sb-refresh-token");
      localStorage.removeItem("user-data");
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
