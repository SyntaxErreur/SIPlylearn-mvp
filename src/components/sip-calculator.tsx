import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Course } from "../lib/schema";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Card, CardContent } from "../components/ui/card";
import { queryClient } from "../lib/queryClient";
import { format } from "date-fns";
import { useToast } from "../hooks/use-toast";
import { Check, TrendingUp, Calendar, DollarSign, PiggyBank, Lock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface SipCalculatorProps {
  courseId: number;
}

const sipDurationOptions = [3, 6, 9, 12] as const;
type SipDuration = typeof sipDurationOptions[number];

interface PlanFeatures {
  totalInvestment: number;
  returnPercentage: number;
  reward: number;
  showAds: boolean;
  domainAccess: string;
  certification: string;
}

const calculatePlanFeatures = (duration: number, dailyAmount: number): PlanFeatures => {
  const totalInvestment = dailyAmount * 30 * duration;

  let features: PlanFeatures = {
    totalInvestment,
    returnPercentage: 0,
    reward: 0,
    showAds: true,
    domainAccess: "1 domain only",
    certification: "-"
  };

  switch (duration) {
    case 3:
      features.returnPercentage = 0;
      break;
    case 6:
      features.returnPercentage = 1;
      features.certification = "University-certified courses";
      break;
    case 9:
      features.returnPercentage = 2;
      features.showAds = false;
      features.domainAccess = "All domains + all lectures";
      features.certification = "University-certified";
      break;
    case 12:
      features.returnPercentage = 4;
      features.showAds = false;
      features.domainAccess = "All domains + all lectures";
      features.certification = "University-certified";
      break;
  }

  features.reward = (features.totalInvestment * features.returnPercentage) / 100;
  return features;
};

export default function SipCalculator({ courseId }: SipCalculatorProps) {
  const { toast } = useToast();
  const [duration, setDuration] = useState<number>(3);
  const [amount, setAmount] = useState<number>(6);
  const [selectedDomain, setSelectedDomain] = useState<string>("");

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses']
  });

  const { data: course } = useQuery<Course>({
    queryKey: [`/api/course/${courseId}`],
  });

  const domains = Array.from(new Set(courses.map(course => course.domain)));
  const coursesByDomain = domains.reduce((acc, domain) => {
    acc[domain] = courses.filter(c => c.domain === domain).length;
    return acc;
  }, {} as Record<string, number>);

  const planFeatures = calculatePlanFeatures(duration, amount);
  const needsDomainSelection = duration <= 6;

  const investMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          amount,
          duration,
          domain: needsDomainSelection ? selectedDomain : undefined,
          type: "sip",
          startDate: format(new Date(), "yyyy-MM-dd"),
        }),
      });
      if (!res.ok) throw new Error('Failed to create investment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/investments"] });
      toast({
        title: "Success!",
        description: "Your investment plan has been created.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
            <Label className="text-lg">Investment Duration</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sipDurationOptions.map((months) => (
              <Button
                key={months}
                variant={duration === months ? "default" : "outline"}
                onClick={() => setDuration(months)}
                className="h-24 flex flex-col gap-1 relative overflow-hidden"
              >
                <span className="text-2xl font-bold">{months}</span>
                <span className="text-sm">Months</span>
                <span className="text-xs font-medium mt-1 px-2 py-0.5 bg-primary/10 rounded-full">
                  {months === 3 ? "0%" : months === 6 ? "1%" : months === 9 ? "2%" : "4%"}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {needsDomainSelection && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <Label className="text-lg">Select Domain Access</Label>
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a domain to access" />
              </SelectTrigger>
              <SelectContent>
                {domains.map(domain => (
                  <SelectItem key={domain} value={domain}>
                    {domain} ({coursesByDomain[domain]} courses)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              For {duration} month plan, you can access courses from one domain
            </p>
          </div>
        )}

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
                <p className="text-2xl font-bold">${amount}</p>
                <p className="text-sm text-muted-foreground">Per Day</p>
              </div>
              <div>
                <p className="text-2xl font-bold">${(amount * 30).toFixed(2)}</p>
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
                    ${planFeatures.totalInvestment.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Investment</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    ${planFeatures.reward.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SIPly Reward ({planFeatures.returnPercentage}%)
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-primary">
                    ${(planFeatures.totalInvestment + planFeatures.reward).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Final Value</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{planFeatures.domainAccess}</span>
                  </div>
                  {planFeatures.certification !== "-" && (
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{planFeatures.certification}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{planFeatures.showAds ? "Contains Ads" : "Ad-free Experience"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            className="w-full h-12 text-lg"
            onClick={() => investMutation.mutate()}
            disabled={investMutation.isPending || (needsDomainSelection && !selectedDomain)}
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