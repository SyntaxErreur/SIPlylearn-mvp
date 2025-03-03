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
  ChevronRight
} from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/investments']
  });

  const totalSavings = investments.reduce((sum, inv) => sum + Number(inv.amount) * 30 * inv.duration, 0);
  const totalReturns = investments.reduce((sum, inv) => {
    const duration = inv.duration;
    const returnRate = duration <= 3 ? 0 : duration <= 6 ? 0.01 : duration <= 9 ? 0.02 : 0.04;
    return sum + (Number(inv.amount) * 30 * duration * returnRate);
  }, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          className="mb-4 hover:bg-transparent hover:text-primary transition-colors" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/40">
              <AvatarFallback className="text-2xl text-primary">
                {user.fullName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-2">Total Savings</h3>
              <p className="text-3xl font-bold">${totalSavings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Across {investments.length} active investments
              </p>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur-sm">
              <h3 className="text-lg font-medium mb-2">Total Returns</h3>
              <p className="text-3xl font-bold text-primary">${totalReturns.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Average return rate of 2% APY
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
                <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Investments</p>
                      <p className="text-sm text-muted-foreground">Track your SIP investments</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link href="/returns">
                <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Returns</p>
                      <p className="text-sm text-muted-foreground">View your earning stats</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-muted-foreground">View detailed statistics</p>
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
              <Link href="/my-courses">
                <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Courses</p>
                      <p className="text-sm text-muted-foreground">View your enrolled courses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {investments.length} Active
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Button>
              </Link>
              <Link href="/certificates">
                <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Scroll className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">My Certificates</p>
                      <p className="text-sm text-muted-foreground">View your achievements</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="ghost" className="w-full justify-between p-4 h-auto hover:bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Terms & Conditions</p>
                      <p className="text-sm text-muted-foreground">Review our policies</p>
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