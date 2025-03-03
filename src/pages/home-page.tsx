import { useQuery } from "@tanstack/react-query";
import { Course, Investment } from "../lib/schema";
import { useAuth } from "../hooks/use-auth";
import CourseCard from "../components/course-card";
import { Button } from "../components/ui/button";
import {
  Bell,
  TrendingUp,
  BarChart3,
  Scroll,
  FileText,
  Play,
} from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<string>("Finance");

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const totalSavings = investments.reduce(
    (sum, inv) => sum + Number(inv.amount) * 30 * inv.duration,
    0
  );
  const ongoingCourses = courses.filter((course) =>
    investments.some((inv) => inv.courseId === course.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Hello, {user?.username}</h1>
            <p className="text-muted-foreground">
              Welcome back to your learning journey
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20">
                    {user?.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary/10 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Total Savings</h3>
            <p className="text-3xl font-bold">${totalSavings.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Invested across {ongoingCourses.length} active courses
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Returns on Savings</h3>
            <p className="text-3xl font-bold">
              ${(totalSavings * 0.02).toFixed(2)}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (2% APY)
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Projected annual returns
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/investments">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <TrendingUp className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">My Investments</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Track your SIP investments
              </p>
            </Card>
          </Link>
          <Link href="/returns">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <BarChart3 className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">My Returns</h3>
              <p className="text-sm text-muted-foreground mt-1">
                View your earning stats
              </p>
            </Card>
          </Link>
          <Link href="/certificates">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <Scroll className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">My Certificates</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Access your achievements
              </p>
            </Card>
          </Link>
          <Link href="/terms">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <FileText className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">T&C</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Review our policies
              </p>
            </Card>
          </Link>
        </div>

        {ongoingCourses.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Course Progress</h2>
            <div className="space-y-4">
              {ongoingCourses.map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <Card className="p-4 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <Play className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {course.author}
                        </p>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>{course.progress}% Completed</span>
                          <span className="text-primary group-hover:underline">
                            Continue Learning
                          </span>
                        </div>
                        <Progress
                          value={course.progress || 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="pt-8 border-t">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Browse Courses</h2>
            <p className="text-muted-foreground">
              Explore our collection of courses in Finance and Technology
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="border rounded-full p-1 inline-flex">
              <Button
                variant={selectedDomain === "Finance" ? "default" : "ghost"}
                className="rounded-full px-8"
                onClick={() => setSelectedDomain("Finance")}
              >
                Finance ({courses.filter((c) => c.domain === "Finance").length})
              </Button>
              <Button
                variant={selectedDomain === "Tech" ? "default" : "ghost"}
                className="rounded-full px-8"
                onClick={() => setSelectedDomain("Tech")}
              >
                Tech ({courses.filter((c) => c.domain === "Tech").length})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses
              .filter((course) => course.domain === selectedDomain)
              .map((course) => (
                <Link key={course.id} href={`/course/${course.id}`}>
                  <div className="transform transition-all hover:-translate-y-1">
                    <CourseCard course={course} />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
