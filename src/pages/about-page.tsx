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
            Your Gateway to Financial Education and Smart Saving Learning
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At SIPly.Learn, we make quality education both accessible and
              affordable through our Systematic Investment Plan (SIP) model. We
              believe that financial constraints should never be a barrier to
              learning.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Premium Courses
                  </h3>
                  <p className="text-muted-foreground">
                    Learn from top industry experts in their domains.
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
                  <h3 className="text-lg font-semibold mb-2">
                    Flexible Payments
                  </h3>
                  <p className="text-muted-foreground">
                    Pay in easy daily, weekly, or monthly installments.
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
                  <h3 className="text-lg font-semibold mb-2">
                    Progress Tracking
                  </h3>
                  <p className="text-muted-foreground">
                    Stay on top of your learning with detailed analytics
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
                  <h3 className="text-lg font-semibold mb-2">
                    Community Support
                  </h3>
                  <p className="text-muted-foreground">
                    Connect, collaborate, and share success stories with
                    like-minded learners.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Why Choose SIPlyLearn?
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We blend smart investment habits with high-quality education,
                ensuring you not only gain knowledge but also develop financial
                discipline.
              </p>
              {/* <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  ✓ Earn rewards while you learn
                </li>
                <li className="flex items-center gap-2">
                  ✓ Industry-recognized certificates
                </li>
                <li className="flex items-center gap-2">
                  ✓ Expert-led courses
                </li>
                <li className="flex items-center gap-2">
                  ✓ Flexible learning paths
                </li>
              </ul> */}
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
