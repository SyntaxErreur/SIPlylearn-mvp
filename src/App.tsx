import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/protected-route";

import HomePage from "./pages/home-page";
import CoursePage from "./pages/course-page";
import ProfilePage from "./pages/profile-page";
import AuthPage from "./pages/auth-page";
import OnboardingPage from "./pages/onboarding-page";
import ActivityPage from "./pages/activity-page";
import TermsPage from "./pages/terms-page";
import PaymentPage from "./pages/payment-page";
import PlansPage from "./pages/plans-page";
import AchievementsPage from "./pages/achievements-page";
import CertificatesPage from "./pages/certificates-page";
import AnalyticsPage from "./pages/analytics-page";
import NotFound from "./pages/not-found";
import AboutPage from "./pages/about-page";
import TermsFullPage from "./pages/terms-full";
import SipSummaryPage from "./pages/sipsummary-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/course/:id" component={CoursePage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/onboarding" component={OnboardingPage} />
      <ProtectedRoute path="/activity" component={ActivityPage} />
      <ProtectedRoute path="/terms" component={TermsPage} />
      <ProtectedRoute path="/summary" component={SipSummaryPage} />
      <ProtectedRoute path="/terms/full" component={TermsFullPage} />
      <ProtectedRoute path="/payment" component={PaymentPage} />
      <ProtectedRoute path="/plans" component={PlansPage} />
      <ProtectedRoute path="/achievements" component={AchievementsPage} />
      <ProtectedRoute path="/certificates" component={CertificatesPage} />
      <ProtectedRoute path="/analytics" component={AnalyticsPage} />
      <ProtectedRoute path="/about" component={AboutPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
