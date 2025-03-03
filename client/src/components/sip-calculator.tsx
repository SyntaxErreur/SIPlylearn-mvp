import { useState } from "react";
import { sipDurationOptions, sipRewards, type Course } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Check, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SipCalculatorProps {
  courseId: number;
}

export default function SipCalculator({ courseId }: SipCalculatorProps) {
  const { toast } = useToast();
  const [duration, setDuration] = useState<number>(3);
  const [amount, setAmount] = useState<number>(1);
  const [selectedDomain, setSelectedDomain] = useState<string>("");

  const { data: courses = [] } = useQuery<Course[]>({ 
    queryKey: ['/api/courses']
  });

  const { data: course } = useQuery<Course>({
    queryKey: [`/api/course/${courseId}`]
  });

  const domains = [...new Set(courses.map(course => course.domain))];
  const coursesByDomain = domains.reduce((acc, domain) => {
    acc[domain] = courses.filter(course => course.domain === domain).length;
    return acc;
  }, {} as Record<string, number>);

  const reward = sipRewards[duration as 3 | 6 | 9 | 12];
  const totalInvestment = amount * 30 * duration;
  const totalReturns = totalInvestment + reward.reward;
  const returnPercentage = (reward.reward / totalInvestment * 100).toFixed(1);

  const showDomainSelection = duration <= 6;

  const investMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/investments", {
        courseId,
        amount,
        duration,
        domain: showDomainSelection ? selectedDomain : undefined,
        type: 'sip',
        startDate: format(new Date(), "yyyy-MM-dd"),
      });
      return await res.json();
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
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">SIPly Investment Plan</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Invest daily in your learning journey. Longer commitments unlock more benefits and higher rewards.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Investment Duration</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {sipDurationOptions.map((months) => (
                <Button
                  key={months}
                  variant={duration === months ? "default" : "outline"}
                  onClick={() => {
                    setDuration(months);
                    if (months > 6) {
                      setSelectedDomain("");
                    }
                  }}
                >
                  {months} Months
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {duration > 6 
                ? "Get access to all domains and maximum rewards" 
                : "Choose a specific domain to access"}
            </p>
          </div>

          <div>
            <Label>Daily Investment Amount</Label>
            <Slider
              value={[amount]}
              onValueChange={([value]) => setAmount(value)}
              min={1}
              max={1000}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>${amount}/day</span>
              <span>${(amount * 30).toFixed(2)}/month</span>
            </div>
          </div>

          {showDomainSelection && (
            <div>
              <Label>Select Domain</Label>
              <Select 
                value={selectedDomain} 
                onValueChange={setSelectedDomain}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {domain} ({coursesByDomain[domain]} courses)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                For {duration} month plan, you get access to courses from your selected domain
              </p>
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Investment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily Investment</span>
                      <span>${amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Investment</span>
                      <span>${(amount * 30).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Investment ({duration} months)</span>
                      <span>${totalInvestment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>SIPly Reward ({returnPercentage}%)</span>
                      <span>${reward.reward.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Final Value</span>
                      <span>${totalReturns.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Plan Benefits</h4>
                  <ul className="space-y-2">
                    {reward.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => investMutation.mutate()}
              disabled={investMutation.isPending || (showDomainSelection && !selectedDomain)}
            >
              Start Investing
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Your settlement will end on {format(new Date().setMonth(new Date().getMonth() + duration), "dd MMMM yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}