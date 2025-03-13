import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { format, addMonths } from "date-fns";
import { Check, X, TrendingUp, DollarSign, Calendar, Lock } from "lucide-react";

/**
 * If you already have a shared getPlanFeatures function,
 * you can import it instead. Otherwise, replicate the logic here.
 */
function getPlanFeatures(duration: number, dailyAmount: number) {
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
    certification: duration <= 3 ? "None" : "University certified courses",
  };
}

export default function SipSummaryPage() {
  const [, setLocation] = useLocation();
  const [sipData, setSipData] = useState<any | null>(null);

  useEffect(() => {
    const storedSip = localStorage.getItem("SIP");
    if (storedSip) {
      setSipData(JSON.parse(storedSip));
    }
  }, []);

  if (!sipData) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">No SIP Data Found</h2>
        <p className="text-sm text-muted-foreground">
          Please set up your SIP plan before viewing the summary.
        </p>
        <Button
          onClick={() => setLocation("/sip-calculator")}
          className="mt-4 px-6"
        >
          Go to SIP Calculator
        </Button>
      </div>
    );
  }

  // Extract SIP data from localStorage
  const { duration, amount, startDate, summaryFrequency } = sipData;

  // Calculate plan features
  const plan = getPlanFeatures(duration, amount);

  // Basic calculations
  const monthlyAmount = amount * 30;
  const totalAmount = plan.savedAmount;
  const finalValue = plan.savedAmount + plan.rewardAmount;
  const endDate = addMonths(new Date(startDate), duration);

  // Continue button handler
  const handleContinue = () => {
    setLocation("/payment");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
      {/* Page Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">SIPly Plan Summary</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Review your plan details below. You’re just one step away from
          completing your saving journey!
        </p>
      </div>

      {/* Summary Content */}
      <Card className="border rounded-md shadow-sm">
        <CardContent className="p-6 space-y-8">
          {/* Plan Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Plan Details</h3>
            <div className="grid grid-cols-1 gap-3">
              {/* Plan Duration */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Plan Duration</span>
                </div>
                <span className="text-base font-semibold">
                  {duration} Months
                </span>
              </div>

              {/* Summary Frequency */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Summary Frequency</span>
                </div>
                <span className="text-base font-semibold capitalize">
                  {summaryFrequency}
                </span>
              </div>

              {/* Domain Access */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Domain Access</span>
                <span className="text-base font-semibold">
                  {plan.domainAccess}
                </span>
              </div>

              {/* Certification */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Certification</span>
                <span className="text-base font-semibold">
                  {plan.certification}
                </span>
              </div>

              {/* Ad-free? */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ad-Free?</span>
                {plan.showAds ? (
                  <X className="h-5 w-5 text-destructive" />
                ) : (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          </div>

          {/* Savings Summary Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">
              Savings Summary
            </h3>
            {/* Daily & Monthly */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">${amount}</p>
                <p className="text-xs text-muted-foreground">Daily</p>
              </div>
              <div>
                <p className="text-2xl font-bold">${monthlyAmount}</p>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </div>
            </div>

            {/* Total Saved & Reward */}
            <div className="grid grid-cols-2 gap-4 text-center mt-4">
              <div>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Total Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  ${plan.rewardAmount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">SIPly Reward</p>
              </div>
            </div>

            {/* Final Value */}
            <div className="bg-primary/10 text-center py-3 rounded-md mt-4">
              <p className="text-3xl font-bold text-primary">
                ${finalValue.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                Final Value (Includes Reward)
              </p>
            </div>
          </div>

          {/* Withdrawal Info */}
          <div className="border-t pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              You can withdraw all your savings after{" "}
              <span className="font-medium text-primary">
                {format(endDate, "dd MMM yyyy")}
              </span>
              .
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button
          size="lg"
          className="px-8 mt-4 inline-flex items-center"
          onClick={handleContinue}
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          Continue
        </Button>
      </div>
    </div>
  );
}
