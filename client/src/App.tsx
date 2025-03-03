import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import BottomNav from "@/components/bottom-nav";

import HomePage from "@/pages/home-page";
import CoursePage from "@/pages/course-page";
import ProfilePage from "@/pages/profile-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Switch>
        <ProtectedRoute path="/" component={HomePage} />
        <ProtectedRoute path="/course/:id" component={CoursePage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;