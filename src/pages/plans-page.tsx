import { useQuery } from "@tanstack/react-query";
import { Investment } from "../lib/schema";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { ArrowLeft, Calendar, DollarSign, Clock } from "lucide-react";
import { Link } from "wouter";
import {
  format,
  addMonths,
  startOfMonth,
  getDaysInMonth,
  isSameDay,
  isBefore,
} from "date-fns";

export default function PlansPage() {
  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  // Add dummy active plan
  const activePlan = {
    id: 1,
    amount: 5,
    duration: 6,
    startDate: "2024-02-01",
    paymentSchedule: "daily", // or "weekly" or "monthly"
  };

  const totalInvestment = activePlan.amount * 30 * activePlan.duration;
  const startDate = new Date(activePlan.startDate);
  const endDate = addMonths(startDate, activePlan.duration);
  const progress = Math.min(
    Math.round(
      ((new Date().getTime() - startDate.getTime()) /
        (endDate.getTime() - startDate.getTime())) *
        100
    ),
    100
  );

  // Generate calendar dates
  const currentMonth = startOfMonth(new Date());
  const daysInMonth = getDaysInMonth(currentMonth);
  const today = new Date();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i + 1
    );
    return {
      date,
      status: isBefore(date, today) ? "paid" : "pending",
    };
  });

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
          <h1 className="text-3xl font-bold mb-2">Running Plans</h1>
          <p className="text-muted-foreground">
            Track your active SIPly savings and payment schedules
          </p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <h3 className="text-lg font-medium">SIPly Savings Value</h3>
              <p className="text-3xl font-bold">${totalInvestment}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium">SIPly Savings Plan</h4>
                <p className="text-sm text-muted-foreground">
                  ${activePlan.amount} daily for {activePlan.duration} months
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${activePlan.amount * 30 * activePlan.duration}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {format(startDate, "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {format(endDate, "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="font-medium mb-3">
                  Payment History - {format(currentMonth, "MMMM yyyy")}
                </h5>
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm text-muted-foreground">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day}>{day}</div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {/* Add empty cells for days before the first of the month */}
                  {Array.from({ length: currentMonth.getDay() }).map(
                    (_, index) => (
                      <div key={`empty-${index}`} className="h-16" />
                    )
                  )}

                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-md ${
                        isSameDay(day.date, today) ? "ring-2 ring-primary" : ""
                      } ${
                        day.status === "paid"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="font-medium">
                        {format(day.date, "dd")}
                      </div>
                      <div className="text-xs mt-1">
                        {format(day.date, "EEE")}
                      </div>
                      <div className="mt-1 text-xs capitalize">
                        {day.status}
                      </div>
                      {day.status === "paid" && (
                        <div className="text-xs mt-1">${activePlan.amount}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
