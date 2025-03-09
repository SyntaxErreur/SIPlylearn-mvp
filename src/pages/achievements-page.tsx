import { useQuery } from "@tanstack/react-query";
import { Investment } from "../lib/schema";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { ArrowLeft, Star, Award, TrendingUp, Target } from "lucide-react";
import { Link } from "wouter";

export default function AchievementsPage() {
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ['/api/investments']
  });

  const totalInvestment = investments.reduce((sum, inv) => sum + (inv.amount * 30 * inv.duration), 0);
  const totalRewards = totalInvestment * 0.02; // 2% rewards rate

  // Mock achievements data - in production this would come from API
  const achievements = [
    {
      title: "First Investment",
      description: "Started your first SIP investment",
      progress: 100,
      completed: true,
    },
    {
      title: "Consistent Learner",
      description: "Completed 30 days of continuous learning",
      progress: 80,
      completed: false,
    },
    {
      title: "Domain Master",
      description: "Completed all courses in a domain",
      progress: 60,
      completed: false,
    },
    {
      title: "Investment Pro",
      description: "Saved more than $1000 through SIPs",
      progress: (totalInvestment / 1000) * 100,
      completed: totalInvestment >= 1000,
    }
  ];

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
          <h1 className="text-3xl font-bold mb-2">Total Achievements</h1>
          <p className="text-muted-foreground">Track your learning and investment milestones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">Total Investment</h3>
                <p className="text-3xl font-bold">${totalInvestment.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">SIPly Rewards</h3>
                <p className="text-3xl font-bold">${totalRewards.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">2% ROS on investments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-medium">Learning Goals</h3>
                <p className="text-3xl font-bold">
                  {achievements.filter(a => a.completed).length}/{achievements.length}
                </p>
                <p className="text-sm text-muted-foreground">Achievements completed</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Learning Achievements
              </h2>
              <div className="space-y-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.completed && (
                        <Award className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <Progress value={achievement.progress} />
                    <p className="text-sm text-right text-muted-foreground">
                      {achievement.progress}% Complete
                    </p>
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
