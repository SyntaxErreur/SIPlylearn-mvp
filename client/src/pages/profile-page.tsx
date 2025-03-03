import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Investment } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  BookOpen,
  Scroll,
  FileText,
  LogOut,
  Wallet,
  TrendingUp,
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
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 pt-8 pb-4 px-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary bg-gradient-to-br from-purple-500 to-orange-400">
            <AvatarFallback className="text-white">
              {user.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{user.fullName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        <Card className="p-4">
          <h2 className="font-semibold mb-4">Investment Section</h2>
          <div className="space-y-3">
            <Link href="/investments" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Wallet className="h-4 w-4 mr-2" />
                My Investments
              </Button>
            </Link>
            <Link href="/returns" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                My Returns
              </Button>
            </Link>
            <Link href="/analytics" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-4">Account Section</h2>
          <div className="space-y-3">
            <Link href="/my-courses" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                My Courses
              </Button>
            </Link>
            <Link href="/certificates" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Scroll className="h-4 w-4 mr-2" />
                My Certificates
              </Button>
            </Link>
            <Link href="/terms" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                T&C
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-xl font-semibold">${totalSavings.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Returns on Savings</p>
              <p className="text-xl font-semibold">${totalReturns.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}