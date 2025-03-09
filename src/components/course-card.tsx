import { Course } from "../lib/schema";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Link } from "wouter";
import { Play, Star } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  // Mock instructor data - in real app this would come from the database
  const instructors = {
    "Master in Finance (Zero to Hero)": "Chanuka Saranga",
    "Master in Fintech (Zero to Hero)": "Sahan Lakshitha",
    "Financial Literacy 101": "Expert Instructor",
  };

  // Mock rating data - in real app this would come from the database
  const rating = 4.5;
  const reviewCount = 128;

  return (
    <Link href={`/course/${course.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Play className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <p className="text-sm text-muted-foreground">
            {instructors[course.title as keyof typeof instructors] ||
              "Expert Instructor"}
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                {course.progress}% Completed
              </span>
            </div>
            <Progress value={course.progress || 0} className="h-2" />
            <a href={`/course/${course.id}`} className="hover:underline">
              Learn more
            </a>
          </div>
        </div>
      </Card>
    </Link>
  );
}
