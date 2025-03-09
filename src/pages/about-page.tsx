import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ArrowLeft, BookOpen, DollarSign, Target, Users } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
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
            Back to Profile
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About SIPlyLearn</h1>
          <p className="text-xl text-muted-foreground">
            Your Gateway to Financial Education and Smart Investment Learning
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              SIPlyLearn is dedicated to making financial education accessible and affordable 
              through our innovative Systematic Investment Plan (SIP) approach. We believe that 
              quality education should be available to everyone, regardless of their financial 
              background.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quality Education</h3>
                  <p className="text-muted-foreground">
                    Access premium courses crafted by industry experts in finance and technology.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Flexible Payments</h3>
                  <p className="text-muted-foreground">
                    Pay for your education through affordable daily, weekly, or monthly installments.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                  <p className="text-muted-foreground">
                    Monitor your learning journey with detailed analytics and progress tracking.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground">
                    Join a growing community of learners and share your success stories.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Why Choose SIPlyLearn?</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                SIPlyLearn combines the power of systematic investment with quality education. 
                Our platform not only helps you learn but also builds a habit of consistent 
                investment in your future.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">✓ Earn rewards while you learn</li>
                <li className="flex items-center gap-2">✓ Industry-recognized certificates</li>
                <li className="flex items-center gap-2">✓ Expert-led courses</li>
                <li className="flex items-center gap-2">✓ Flexible learning paths</li>
              </ul>
            </div>
          </Card>

          <div className="text-center">
            <Link href="/courses">
              <Button size="lg" className="px-8">
                Start Learning Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
