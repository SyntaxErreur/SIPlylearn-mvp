import React from "react";
import { useAuth } from "../hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Investment } from "../lib/schema";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import {
  BarChart3,
  BookOpen,
  Scroll,
  FileText,
  LogOut,
  Wallet,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
  Info,
  Pencil,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const totalSavings = investments.reduce((sum, inv) => {
    if (inv.type === "sip") {
      return sum + Number(inv.amount) * 30 * inv.duration;
    }
    // For one-time payments
    return sum + Number(inv.amount);
  }, 0);

  const totalReturns = investments.reduce((sum, inv) => {
    if (inv.type === "sip") {
      const duration = inv.duration;
      // Apply different APY based on duration
      const apy =
        duration <= 3 ? 0 : duration <= 6 ? 0.02 : duration <= 9 ? 0.04 : 0.08;
      return sum + Number(inv.amount) * 30 * duration * (apy * (duration / 12));
    }
    // For one-time payments, apply a fixed 1% return
    return sum + Number(inv.amount) * 0.01;
  }, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="hover:bg-transparent hover:text-primary transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Link href="/">
            <img
              src="/SIPlyLearn-purple.png"
              alt="SIPlyLearn Logo"
              className="h-8 cursor-pointer"
            />
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/40">
              <AvatarFallback className="text-2xl text-primary">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-2">SIPly Savings</h3>
              <p className="text-3xl font-bold">
                $
                {localStorage.getItem("SIP")
                  ? (
                      JSON.parse(localStorage.getItem("SIP") as string)
                        .amount || 0
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-2">SIPly Returns</h3>
              <p className="text-3xl font-bold text-primary">
                $0.00
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (
                  {localStorage.getItem("SIP")
                    ? (
                        parseFloat(
                          JSON.parse(localStorage.getItem("SIP") as string)
                            .returnsPercentage
                        ) || 0
                      ).toFixed(2)
                    : "0.00"}
                  % ROS)
                </span>
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6 max-w-4xl">
        <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
          <div className="p-4">
            <h2 className="font-semibold text-lg mb-4">Investment Journey</h2>
            <div className="space-y-2">
              <Link href="/investments">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Investments</p>
                      <p className="text-sm text-muted-foreground">
                        Track your SIP investments
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link href="/returns">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Returns</p>
                      <p className="text-sm text-muted-foreground">
                        View your earning stats
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        View detailed statistics
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">About SIPly</p>
                      <p className="text-sm text-muted-foreground">
                        Learn more about our platform
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
          <div className="p-4">
            <h2 className="font-semibold text-lg mb-4">Learning Resources</h2>
            <div className="space-y-2">
              {/* <Link href="/my-courses">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Courses</p>
                      <p className="text-sm text-muted-foreground">
                        View your enrolled courses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {investments.length} Active
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Button>
              </Link> */}
              <Link href="/certificates">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Scroll className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Certificates</p>
                      <p className="text-sm text-muted-foreground">
                        View your achievements
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link href="/terms/full">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Terms & Conditions</p>
                      <p className="text-sm text-muted-foreground">
                        Review our policies
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Button
          variant="destructive"
          className="w-full py-6 text-lg"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
