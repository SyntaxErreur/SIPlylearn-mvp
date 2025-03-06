import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSuccess(true);
    setTimeout(() => {
      setLocation("/");
    }, 3000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mb-6">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            You now have access to the course. Redirecting to dashboard...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="max-w-md mx-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Secure Payment</h1>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="card">Card Number</Label>
              <Input 
                id="card" 
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input 
                  id="expiry" 
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  placeholder="123"
                  maxLength={3}
                  type="password"
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Complete Payment"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              This is a demo payment page. No actual payment will be processed.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
