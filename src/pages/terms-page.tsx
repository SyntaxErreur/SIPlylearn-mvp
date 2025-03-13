import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const [, setLocation] = useLocation();
  const [accepted, setAccepted] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const isFullPayment = params.get("type") === "full";

  const handleContinue = () => {
    if (accepted) {
      setLocation("/summary");
    }
  };

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

        <Card className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Terms and Conditions</h1>

          <div className="space-y-6">
            {!isFullPayment && (
              <>
                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    1. Early Withdrawal Policy
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      If a user discontinues their SIP and requests a withdrawal
                      before completing 50% of the chosen tenure, they will not
                      be eligible for any interest on the saved amount.
                    </li>
                    <li>
                      Additionally, 30% of the saved amount will be deducted as
                      early processing fees and operational charges.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    2. Minimum SIP Commitment
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Users are required to contribute to their SIP for a
                      minimum of one month from the start of their tenure.
                    </li>
                    <li>
                      If a user discontinues the SIP within the first month,
                      thereby breaching the buffer period, the saved amount will
                      not be withdrawable under any circumstances.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    3. Buffer Time Policy
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Users are allowed a maximum of 14 days of buffer time
                      within their SIP tenure.
                    </li>
                    <li>
                      If the buffer time is exceeded, the interest return for
                      that particular month will not be credited to the user's
                      SIPly Rewards.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-3">
                    4. Withdrawal Processing Time
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Once a withdrawal request is submitted, the saved amount
                      (after applicable deductions) will be credited to the
                      user's registered account within three working days.
                    </li>
                  </ul>
                </div>
              </>
            )}

            {isFullPayment && (
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  Full Payment Terms
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    The full payment option provides immediate access to all
                    course content.
                  </li>
                  <li>
                    Payments are non-refundable after 7 days from the date of
                    purchase.
                  </li>
                  <li>
                    Refund requests within the 7-day period will be processed
                    within 3-5 business days.
                  </li>
                  <li>
                    Course access is granted for the entire duration of the
                    course availability.
                  </li>
                </ul>
              </div>
            )}

            <div className="pt-6 border-t">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  I have read and agree to the Terms and Conditions
                </label>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              disabled={!accepted}
              onClick={handleContinue}
            >
              Proceed to Payment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
