import { useQuery } from "@tanstack/react-query";
import { Course } from "../lib/schema";
import { useAuth } from "../hooks/use-auth";
import CourseCard from "../components/course-card";
import { Button } from "../components/ui/button";
import {
  Bell,
  BarChart3,
  Scroll,
  FileText,
  Play,
  Users,
  Activity,
  Timer,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { useState, useEffect } from "react";
import { mockCourses } from "../data/mockCourses";
import { storageService } from "../lib/storage";
import CommunityCounter from "../components/community-counter";

export default function HomePage() {
  const { user } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState<string>("Finance");
  const [Savings, setSavings] = useState(() => storageService.getSavings());
  const [metrics, setMetrics] = useState(() =>
    storageService.calculateSavingMetrics()
  );

  const { data: courses = mockCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Update metrics and Savings when storage changes
  useEffect(() => {
    const handleStorageUpdate = () => {
      const newSavings = storageService.getSavings();
      setSavings(newSavings);
      setMetrics(storageService.calculateSavingMetrics());
    };

    // Update on mount and when storage changes
    handleStorageUpdate();

    // Listen for storage updates
    window.addEventListener("storage-updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage-updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const ongoingCourses = courses.filter((course) =>
    Savings.some((inv) => inv.courseId === course.id)
  );

  // Define greetings in different languages
  const greetings = [
    "Hello",
    "Bonjour",
    "Hola",
    "Ciao",
    "こんにちは",
    "안녕하세요",
    "Hallo",
  ];
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger fade-out
      setIsFading(true);
      // After fade-out duration, update greeting randomly and fade back in
      setTimeout(() => {
        setGreetingIndex((prev) => {
          let nextIndex = prev;
          // Ensure new greeting is different from the current one
          while (nextIndex === prev) {
            nextIndex = Math.floor(Math.random() * greetings.length);
          }
          return nextIndex;
        });
        setIsFading(false);
      }, 500); // 500ms fade duration
    }, 2000); // Change greeting every 5 seconds

    return () => clearInterval(interval);
  }, [greetings.length]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-row md:flex-row justify-between items-center">
          {/* Left Section: Logo and Greeting */}
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
            <Link href="/">
              <img
                src="/SIPlyLearn-purple.png"
                alt="SIPlyLearn Logo"
                className="h-8 cursor-pointer"
              />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-l md:text-2xl font-bold">
                <span
                  style={{
                    opacity: isFading ? 0 : 1,
                    transition: "opacity 0.5s ease-in-out",
                  }}
                >
                  {greetings[greetingIndex]}
                </span>
                {", "} {user?.fullName ? user?.fullName.split(' ')[0] : user?.username || "User"}
              </h1>
              {/* Hide the tagline on mobile to save space */}
              <p className="text-sm text-muted-foreground hidden md:block">
                <b>S</b>tudy . <b>I</b>nvest . <b>P</b>erform
              </p>
            </div>
          </div>

          {/* Right Section: Community Info, Notifications & Profile */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Hide community info on extra small screens */}
            <CommunityCounter />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20">
                      {user?.username ? user.username.charAt(0).toUpperCase() : user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary/10 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">SIPly Savings</h3>
            <p className="text-3xl font-bold">
              $
              {localStorage.getItem("SIP")
                ? (
                    JSON.parse(localStorage.getItem("SIP") as string).amount ||
                    0
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">SIPly Rewards</h3>
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/activity">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <Activity className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">My Activity</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Track your learning progress
              </p>
            </Card>
          </Link>
          <Link href="/plans">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <Timer className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">Running Plan</h3>
              <p className="text-sm text-muted-foreground mt-1">
                View active subscriptions
              </p>
            </Card>
          </Link>
          <Link href="/achievements">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <Trophy className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">Total Achievements</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your learning milestones
              </p>
            </Card>
          </Link>
          <Link href="/certificates">
            <Card className="p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 group">
              <Scroll className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="font-medium">My Certificates</h3>
              <p className="text-sm text-muted-foreground mt-1">
                View your credentials
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
              Explore our collection of courses across various domains
            </p>
          </div>

          <div className="flex justify-center mb-8 overflow-x-auto pb-4">
            <div className="border rounded-full p-1 inline-flex space-x-1">
              {[
                "Finance",
                "Tech",
                "Data Science",
                "Business",
                "Language Learning",
                "Social Science",
                "IT",
                "Computer Science",
                "Personal Development",
              ].map((domain) => (
                <Button
                  key={domain}
                  variant={selectedDomain === domain ? "default" : "ghost"}
                  className="rounded-full px-4 whitespace-nowrap"
                  onClick={() => setSelectedDomain(domain)}
                >
                  {domain}
                </Button>
              ))}
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

          {/* <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">
              Want to explore more courses?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover a wide range of courses across different domains. Our
              expert instructors are here to guide you through your learning
              journey.
            </p>
            <Link href="/courses">
              <Button size="lg" className="px-8">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div> */}
        </div>
      </main>
    </div>
  );
}