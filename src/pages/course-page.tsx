import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Course } from "../lib/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import SipCalculator from "../components/sip-calculator";
import CourseReviews from "../components/course-reviews";
import { useToast } from "../hooks/use-toast";
import { storageService } from "../lib/storage";

// Mock data for the course contents
const courseContents = [
  {
    title: "Finance Fundamentals",
    lectures: [
      {
        title: "Corporate Finance Fundamentals",
        duration: "2 hours video",
      },
      {
        title: "Accounting Fundamentals",
        duration: "45 minutes video",
      },
    ],
  },
  {
    title: "Investment Basics",
    lectures: [
      {
        title: "Reading Financial Statements",
        duration: "3 hours & 27 minutes video",
      },
      {
        title: "Introduction to Capital Markets",
        duration: "14 minutes video",
      },
      {
        title: "Economics for Capital Markets",
        duration: "26 minutes video",
      },
    ],
  },
];

const faqs = [
  {
    question: "What is the refund policy?",
    answer: "Our refund policy allows for a full refund within 7 days of purchase if you're not satisfied with the course.",
  },
  {
    question: "Can I just enroll in a single course?",
    answer: "Yes, you can enroll in individual courses or choose a SIP plan for better value and additional benefits.",
  },
  {
    question: "Is financial aid available?",
    answer: "We offer flexible SIP plans starting from just $1/day to make learning accessible to everyone.",
  },
];

// Add mock reviews data
const reviews = [
  {
    id: 1,
    user: "John Smith",
    rating: 4.5,
    comment: "Excellent course! The content is well-structured and easy to follow. The practical examples really helped solidify the concepts.",
    date: "2024-03-01"
  },
  {
    id: 2,
    user: "Sarah Johnson",
    rating: 5,
    comment: "One of the best finance courses I've taken. The instructor explains complex topics in a very understandable way.",
    date: "2024-02-28"
  },
  {
    id: 3,
    user: "Michael Brown",
    rating: 4,
    comment: "Great course overall. Would love to see more advanced topics covered in future updates.",
    date: "2024-02-25"
  }
];

export default function CoursePage() {
  const [, params] = useRoute("/course/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: course } = useQuery<Course>({
    queryKey: [`/api/course/${params?.id}`],
  });

  if (!course) return null;

  // Handle direct payment
  const handleDirectPayment = () => {
    try {
      const investment = {
        courseId: parseInt(params?.id || "0"),
        amount: course.price || 0,
        duration: 1,
        type: 'full' as const,
        startDate: new Date().toISOString(),
      };

      // Create investment directly in storage
      storageService.createInvestment(investment);

      toast({
        title: "Payment successful",
        description: "You now have access to this course!",
      });

      // Navigate to home page
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="object-cover w-full h-full"
              />
              <Button size="icon" className="absolute inset-0 m-auto bg-white/20 hover:bg-white/40">
                <Play className="h-12 w-12" />
              </Button>
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contents">Contents</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="other">Other Info</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
                    <p className="text-muted-foreground mb-6">{course.description}</p>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Advance your subject-matter expertise</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">✓ Learn in-demand skills from university and industry experts</li>
                        <li className="flex items-center gap-2">✓ Master a subject or tool with hands-on projects</li>
                        <li className="flex items-center gap-2">✓ Develop a deep understanding of key concepts</li>
                        <li className="flex items-center gap-2">✓ Earn a career certificate from Corporate Finance Institute</li>
                      </ul>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Course Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contents">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Course Contents</h2>
                    <Accordion type="single" collapsible className="w-full">
                      {courseContents.map((section, index) => (
                        <AccordionItem key={index} value={`section-${index}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center">
                              <span>{section.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pl-4">
                              {section.lectures.map((lecture, lectureIndex) => (
                                <div key={lectureIndex} className="flex items-center gap-4">
                                  <Play className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{lecture.title}</p>
                                    <p className="text-sm text-muted-foreground">{lecture.duration}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6">
                    <CourseReviews reviews={reviews} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="other">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible>
                      {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button className="w-full">SIP It</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SipCalculator courseId={parseInt(params?.id || "0")} />
                    </SheetContent>
                  </Sheet>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleDirectPayment}
                  >
                    Pay at once
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}