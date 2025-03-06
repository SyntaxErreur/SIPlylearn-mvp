import { useAuth } from "../hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { ArrowLeft, Clock, Trophy, Users, Activity } from "lucide-react";
import { Link } from "wouter";

// Mock data for leaderboard - this would come from your API in production
const leaderboardData = [
  { id: 1, name: "Sarah Johnson", hours: 156, rank: 1 },
  { id: 2, name: "Michael Chen", hours: 142, rank: 2 },
  { id: 3, name: "Emma Davis", hours: 135, rank: 3 },
  { id: 4, name: "James Wilson", hours: 128, rank: 4 },
  { id: 5, name: "Lisa Anderson", hours: 120, rank: 5 },
];

export default function ActivityPage() {
  const { user } = useAuth();
  
  // Mock user stats - would come from API
  const userStats = {
    totalHours: 82,
    rank: 12,
    totalUsers: 234,
    weeklyProgress: 75,
  };

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

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Learning Activity</h1>
          <p className="text-muted-foreground">Track your progress and compare with other learners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">Total Hours</h3>
                <p className="text-3xl font-bold">{userStats.totalHours}h</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">Your Rank</h3>
                <p className="text-3xl font-bold">#{userStats.rank}</p>
                <p className="text-sm text-muted-foreground">
                  of {userStats.totalUsers} learners
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">Weekly Progress</h3>
                <Progress value={userStats.weeklyProgress} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {userStats.weeklyProgress}% of weekly goal
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Learning Leaderboard</h2>
              <div className="space-y-4">
                {leaderboardData.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-colors
                      ${index === 0 ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-semibold">
                        {user.rank}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.hours} hours of learning
                      </p>
                    </div>
                    {index < 3 && (
                      <Trophy className={`h-5 w-5 
                        ${index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-amber-600'}`} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
