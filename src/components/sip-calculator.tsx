import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Course } from "../lib/schema";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Card, CardContent } from "../components/ui/card";
import { queryClient } from "../lib/queryClient";
import { format } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { Check, X, TrendingUp, Calendar, DollarSign, PiggyBank, Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface SipCalculatorProps {
  courseId: number;
}

const sipDurationOptions = [3, 6, 9, 12] as const;
type SipDuration = typeof sipDurationOptions[number];

interface PlanFeatures {
  savedAmount: number;
  rewardAmount: number;
  showAds: boolean;
  domainAccess: string;
  certification: string;
}

const getPlanFeatures = (duration: number): PlanFeatures => {
  const features: Record<number, PlanFeatures> = {
    3: {
      savedAmount: 91,
      rewardAmount: 0,
      showAds: true,
      domainAccess: "Selected domain only",
      certification: "-"
    },
    6: {
      savedAmount: 182,
      rewardAmount: 1.82,
      showAds: true,
      domainAccess: "Two domains access",
      certification: "University certified courses"
    },
    9: {
      savedAmount: 273,
      rewardAmount: 5.46,
      showAds: false,
      domainAccess: "All domains access",
      certification: "University certified courses"
    },
    12: {
      savedAmount: 365,
      rewardAmount: 14.6,
      showAds: false,
      domainAccess: "All domains access",
      certification: "University certified courses"
    }
  };
  return features[duration];
};

export default function SipCalculator({ courseId }: SipCalculatorProps) {
  const { toast } = useToast();
  const [duration, setDuration] = useState<number>(3);
  const [amount, setAmount] = useState<number>(1);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [, setLocation] = useLocation();


  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses']
  });

  const { data: course } = useQuery<Course>({
    queryKey: [`/api/course/${courseId}`],
  });

  const currentPlan = getPlanFeatures(duration);
  const dailyAmount = amount;
  const monthlyAmount = dailyAmount * 30;
  const totalAmount = monthlyAmount * duration;

  // Get unique domains from courses
  const domains = Array.from(new Set(courses.map(course => course.domain)));

  const needsDomainSelection = duration <= 6;
  const maxDomains = duration === 3 ? 1 : duration === 6 ? 2 : domains.length;

  const handleDomainChange = (domain: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domain)) {
        return prev.filter(d => d !== domain);
      }
      if (prev.length < maxDomains) {
        return [...prev, domain];
      }
      return [...prev.slice(1), domain];
    });
  };

  const handlePayment = () => {
    if (needsDomainSelection && selectedDomains.length === 0) {
      return;
    }
    setLocation("/terms");
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">SIPly Investment Plan</h2>
        <p className="text-muted-foreground">
          Invest smart in your education with our flexible SIP plans
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <Label className="text-lg">Choose Your Plan Duration</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sipDurationOptions.map((months) => {
              const features = getPlanFeatures(months);
              return (
                <Card
                  key={months}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    duration === months ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setDuration(months)}
                >
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">{months}</div>
                    <div className="text-sm">Months</div>
                    <div className="text-xs font-medium mt-2 px-2 py-0.5 bg-primary/10 rounded-full">
                      {features.rewardAmount > 0 ? `${(features.rewardAmount / features.savedAmount * 100).toFixed(1)}% APY` : "No Rewards"}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm border-t pt-3">
                    <div className="flex items-center gap-2">
                      {!features.showAds ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                      <span>Ad-free Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{features.domainAccess}</span>
                    </div>
                    {features.certification !== "-" && (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{features.certification}</span>
                      </div>
                    )}
                  </div>

                  {/* Domain Selection for 3 and 6 month plans */}
                  {(months === duration && needsDomainSelection) && (
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Select Domains ({selectedDomains.length}/{maxDomains})</span>
                      </div>
                      <div className="space-y-2">
                        {domains.map(domain => (
                          <button
                            key={domain}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDomainChange(domain);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              selectedDomains.includes(domain)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {domain}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <Label className="text-lg">Daily Investment</Label>
          </div>
          <Card className="p-6">
            <Slider
              value={[amount]}
              onValueChange={([value]) => setAmount(value)}
              min={1}
              max={100}
              step={1}
              className="mb-4"
            />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">${dailyAmount}</p>
                <p className="text-sm text-muted-foreground">Per Day</p>
              </div>
              <div>
                <p className="text-2xl font-bold">${monthlyAmount}</p>
                <p className="text-sm text-muted-foreground">Per Month</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PiggyBank className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Investment Summary</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold">
                    ${totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Investment</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    ${currentPlan.rewardAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SIPly Reward
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold text-primary">
                    ${(totalAmount + currentPlan.rewardAmount).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Final Value</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            className="w-full h-12 text-lg"
            onClick={handlePayment}
            disabled={needsDomainSelection && selectedDomains.length === 0}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Start Your Investment Journey
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Your plan will complete on{" "}
            {format(
              new Date().setMonth(new Date().getMonth() + duration),
              "dd MMMM yyyy"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}