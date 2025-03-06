import { useQuery } from "@tanstack/react-query";
import { Course } from "../lib/schema";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, Download, Share2, ScrollText } from "lucide-react";
import { Link } from "wouter";

export default function CertificatesPage() {
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses']
  });

  // Add dummy completed courses
  const completedCourses = [
    {
      id: 1,
      title: "Introduction to Financial Markets",
      progress: 100,
      completionDate: "2024-02-15",
      domain: "Finance"
    },
    {
      id: 2,
      title: "Advanced Trading Strategies",
      progress: 100,
      completionDate: "2024-03-01",
      domain: "Finance"
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
          <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
          <p className="text-muted-foreground">View and download your course completion certificates</p>
        </div>

        {completedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-[1.4/1] relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <ScrollText className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completed on {new Date(course.completionDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete courses to earn your certificates
            </p>
            <Link href="/">
              <Button>Browse Courses</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}