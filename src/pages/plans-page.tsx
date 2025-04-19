import { useQuery } from "@tanstack/react-query";
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
} from "date-fns";
import { supabase } from "../lib/supabase.ts";

export default function PlansPage() {
  // Fetch the active saving plan
  const {
    data: activePlanData,
    isLoading: isPlanLoading,
    isError: isPlanError,
  } = useQuery({
    queryKey: ["active-plan"],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("savings")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const currentMonth = startOfMonth(new Date());

  // Fetch payments (Hook is always declared regardless of plan data)
  const {
    data: paymentsData = [],
    isLoading: isPaymentsLoading,
  } = useQuery({
    queryKey: ["payments", activePlanData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("date, status")
        .eq("saving_id", activePlanData.id)
        .gte("date", currentMonth.toISOString())
        .eq("saving_id", activePlanData.id)
        .gte("date", currentMonth.toISOString())
        .lt("date", addMonths(currentMonth, 1).toISOString())
        

      if (error) throw error;
      return data;
    },
    enabled: !!activePlanData?.id,
  });

  if (isPlanLoading || !activePlanData) {
    return <div className="p-6">Loading active plan...</div>;
  }

  const activePlan = {
    id: activePlanData.id,
    amount: activePlanData.amount,
    duration: activePlanData.duration,
    startDate: activePlanData.start_date,
    paymentSchedule: activePlanData.paymentSchedule,
  };

  const startDate = new Date(activePlan.startDate);
  const endDate = addMonths(startDate, activePlan.duration);
  const totalSaving = activePlan.amount * 30 * activePlan.duration;
  const progress = Math.min(
    Math.round(
      ((new Date().getTime() - startDate.getTime()) /
        (endDate.getTime() - startDate.getTime())) *
        100
    ),
    100
  );

  const daysInMonth = getDaysInMonth(currentMonth);

  const paidDates = new Set(
    paymentsData
      .filter((payment) => payment.status === "completed")
      .map((payment) => format(new Date(payment.date), "yyyy-MM-dd"))
  );

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      i + 1
    );
    const formattedDate = format(date, "yyyy-MM-dd");

    return {
      date,
      status: paidDates.has(formattedDate) ? "paid" : "pending",
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
              <h3 className="text-lg font-medium">Total Savings</h3>
              <p className="text-3xl font-bold">${totalSaving}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium">SIPly Savings</h4>
                <p className="text-sm text-muted-foreground">
                  ${activePlan.amount} daily for {activePlan.duration} months
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${totalSaving}</p>
                <p className="text-sm text-muted-foreground">
                  Estimated Total Value
                </p>
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
                  {Array.from({ length: currentMonth.getDay() }).map(
                    (_, index) => (
                      <div key={`empty-${index}`} className="h-16" />
                    )
                  )}

                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-md ${
                        isSameDay(day.date, new Date())
                          ? "ring-2 ring-primary"
                          : ""
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
                        <div className="text-xs mt-1">
                          ${activePlan.amount}+
                        </div>
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
