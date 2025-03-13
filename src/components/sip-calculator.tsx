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
import {
  Check,
  X,
  TrendingUp,
  Calendar,
  DollarSign,
  PiggyBank,
  Lock,
} from "lucide-react";
import { apiRequest } from "../lib/api";

interface SipCalculatorProps {
  courseId: number;
}

const sipDurationOptions = [3, 6, 9, 12] as const;
type SipDuration = (typeof sipDurationOptions)[number];

const summaryFrequencyOptions = ["daily", "weekly", "monthly"] as const;

interface PlanFeatures {
  savedAmount: number;
  rewardAmount: number;
  showAds: boolean;
  domainAccess: string;
  certification: string;
}

interface Saving {
  courseId: number;
  amount: number;
  duration: number;
  type: "sip" | "full";
  startDate: string;
}

function getPlanFeatures(duration: number, dailyAmount: number): PlanFeatures {
  const savedAmount = dailyAmount * 30 * duration;
  const getROS = (months: number): number => {
    if (months === 3) return 0;
    if (months === 6) return 0.01;
    if (months === 9) return 0.02;
    if (months === 12) return 0.04;
    return 0;
  };
  const apy = getROS(duration);
  const rewardAmount = savedAmount * apy;

  return {
    savedAmount,
    rewardAmount: Number(rewardAmount.toFixed(2)),
    showAds: duration <= 6,
    domainAccess:
      duration <= 3
        ? "Selected domain only"
        : duration <= 6
        ? "Two domains access"
        : "All domains access",
    certification: duration <= 3 ? "-" : "University certified courses",
  };
}

export default function SipCalculator({ courseId }: SipCalculatorProps) {
  const { toast } = useToast();
  const [duration, setDuration] = useState<number>(3);
  const [amount, setAmount] = useState<number>(1);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [summaryFrequency, setSummaryFrequency] = useState("daily");
  const [, setLocation] = useLocation();

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: course } = useQuery<Course>({
    queryKey: [`/api/course/${courseId}`],
  });

  const currentPlan = getPlanFeatures(duration, amount);
  const dailyAmount = amount;
  const monthlyAmount = dailyAmount * 30;
  const totalAmount = monthlyAmount * duration;

  const domains = Array.from(new Set(courses.map((course) => course.domain)));

  const needsDomainSelection = duration <= 6;
  const maxDomains = duration === 3 ? 1 : duration === 6 ? 2 : domains.length;

  const handleDomainChange = (domain: string) => {
    setSelectedDomains((prev) => {
      if (prev.includes(domain)) {
        return prev.filter((d) => d !== domain);
      }
      if (prev.length < maxDomains) {
        return [...prev, domain];
      }
      return [...prev.slice(1), domain];
    });
  };

  // New function to handle immediate storage of summaryFrequency
  const handleSummaryFrequencyChange = (option: string) => {
    setSummaryFrequency(option);
    localStorage.setItem("SIP_Frequency", option);
  };

  const createSavingMutation = useMutation({
    mutationFn: async (saving: Saving) => {
      const res = await apiRequest("POST", "/api/Savings", saving);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/Savings"] });
      toast({
        title: "Saving created",
        description: "Your SIP plan has been set up successfully!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create Saving",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    if (needsDomainSelection && selectedDomains.length === 0) {
      toast({
        title: "Domain selection required",
        description: "Please select your preferred learning domains.",
        variant: "destructive",
      });
      return;
    }

    // Calculate returns percentage for display purposes
    const features = getPlanFeatures(duration, amount);
    const returnsPercentage =
      features.rewardAmount > 0
        ? ((features.rewardAmount / features.savedAmount) * 100).toFixed(1)
        : "0";

    const existingSip = localStorage.getItem("SIP");
    const sipDetails = {
      courseId,
      amount,
      duration,
      type: "sip" as const,
      startDate: existingSip
        ? JSON.parse(existingSip).startDate
        : new Date().toISOString(),
      returnsPercentage,
      // include the selected summary frequency
      summaryFrequency,
    };

    // Save the entire plan to local storage
    localStorage.setItem("SIP", JSON.stringify(sipDetails));

    // Navigate to terms page
    setLocation("/terms");
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">SIPly Saving Plan</h2>
        <p className="text-muted-foreground">
          Sip it and set up an automatic recurring savings plan to unlock access
          to <strong className="text-primary">NOT JUST ONE COURSE</strong>, but{" "}
          <strong className="text-primary">ALL COURSES</strong> within your
          selected domains.
        </p>
      </div>

      <div className="space-y-8">
        {/* Plan Duration Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <Label className="text-lg">Choose Your Plan Duration</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sipDurationOptions.map((months) => {
              const features = getPlanFeatures(months, amount);
              return (
                <Card
                  key={months}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    duration === months ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setDuration(months)}
                >
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">{months}</div>
                    <div className="text-sm">Months</div>
                    <div className="text-xs font-medium mt-2 px-2 py-0.5 bg-primary/10 rounded-full">
                      {features.rewardAmount > 0
                        ? `${(
                            (features.rewardAmount / features.savedAmount) *
                            100
                          ).toFixed(1)}% ROS`
                        : "No Rewards"}
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

                  {months === duration && needsDomainSelection && (
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          Select Domains ({selectedDomains.length}/{maxDomains})
                        </span>
                      </div>
                      <div className="space-y-2 max-h-[100px] overflow-y-auto">
                        {domains.map((domain) => (
                          <button
                            key={domain}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDomainChange(domain);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                              selectedDomains.includes(domain)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
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

        {/* Daily Saving Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <Label className="text-lg">Daily Saving</Label>
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

        {/* FlexiPayout Selection */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Label className="text-lg">Select FlexiPayout</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryFrequencyOptions.map((option) => (
              <Card
                key={option}
                className={`p-4 cursor-pointer transition-all text-sm hover:shadow-md text-center ${
                  summaryFrequency === option
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => handleSummaryFrequencyChange(option)}
              >
                <div className="font-bold">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Saving Summary Section */}
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PiggyBank className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Saving Summary</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold">
                    ${totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Saving</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    ${currentPlan.rewardAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">SIPly Reward</p>
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

        {/* Action Button & Completion Date */}
        <div className="space-y-4">
          <Button
            className="w-full h-12 text-lg"
            onClick={handlePayment}
            disabled={needsDomainSelection && selectedDomains.length === 0}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Start Your Saving Journey
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
