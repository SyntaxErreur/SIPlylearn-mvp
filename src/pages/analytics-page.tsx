import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Mock data for the charts
const monthlyProgress = [
  { month: 'Jan', hours: 45, courses: 2 },
  { month: 'Feb', hours: 62, courses: 3 },
  { month: 'Mar', hours: 58, courses: 2 },
  { month: 'Apr', hours: 71, courses: 4 },
  { month: 'May', hours: 66, courses: 3 },
  { month: 'Jun', hours: 85, courses: 5 },
];

const investmentData = [
  { month: 'Jan', savings: 150, returns: 3 },
  { month: 'Feb', savings: 300, returns: 6 },
  { month: 'Mar', savings: 450, returns: 9 },
  { month: 'Apr', savings: 600, returns: 12 },
  { month: 'May', savings: 750, returns: 15 },
  { month: 'Jun', savings: 900, returns: 18 },
];

const completionRates = [
  { category: 'Finance Basics', completed: 85, ongoing: 15 },
  { category: 'Investment', completed: 65, ongoing: 35 },
  { category: 'Trading', completed: 45, ongoing: 55 },
  { category: 'Tech', completed: 70, ongoing: 30 },
];

const dailyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 2.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 3.7 },
  { day: 'Sat', hours: 1.5 },
  { day: 'Sun', hours: 2.0 },
];

export default function AnalyticsPage() {
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

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress and investment growth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Monthly Learning Progress</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="hours" fill="#8884d8" name="Hours Spent" />
                  <Bar yAxisId="right" dataKey="courses" fill="#82ca9d" name="Courses Taken" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Investment Growth</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={investmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="savings" stroke="#8884d8" name="Total Savings ($)" />
                  <Line type="monotone" dataKey="returns" stroke="#82ca9d" name="Returns ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Course Completion Rates</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionRates} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="1" fill="#8884d8" name="Completed (%)" />
                  <Bar dataKey="ongoing" stackId="1" fill="#82ca9d" name="Ongoing (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Daily Activity</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="hours" fill="#8884d8" name="Hours per Day" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
