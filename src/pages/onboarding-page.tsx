import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";

const domains = [
  {
    id: "finance",
    name: "Finance",
    description: "Master financial markets, investment strategies, and money management",
    icon: "💰"
  },
  {
    id: "tech",
    name: "Tech",
    description: "Learn programming, web development, and modern tech stack",
    icon: "💻"
  },
  {
    id: "data-science",
    name: "Data Science",
    description: "Explore data analysis, machine learning, and AI applications",
    icon: "📊"
  },
  {
    id: "business",
    name: "Business",
    description: "Study business strategy, marketing, and entrepreneurship",
    icon: "💼"
  },
  {
    id: "language-learning",
    name: "Language Learning",
    description: "Master new languages for personal and professional growth",
    icon: "🗣️"
  },
  {
    id: "social-science",
    name: "Social Science",
    description: "Understand human behavior, society, and cultural dynamics",
    icon: "🌍"
  },
  {
    id: "it",
    name: "IT",
    description: "Learn network security, system administration, and IT services",
    icon: "🔧"
  },
  {
    id: "computer-science",
    name: "Computer Science",
    description: "Study algorithms, operating systems, and computer architecture",
    icon: "⚡"
  },
  {
    id: "personal-development",
    name: "Personal Development",
    description: "Enhance leadership, communication, and soft skills",
    icon: "🎯"
  }
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  const toggleDomain = (domainId: string) => {
    setSelectedDomains(prev =>
      prev.includes(domainId)
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const handleContinue = () => {
    if (selectedDomains.length > 0) {
      localStorage.setItem('hasCompletedOnboarding', 'true');
      // Here we could save the selected domains to user preferences
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="text-center mb-12">
          <img 
            src="/SIPlyLearn-purple.png" 
            alt="SIPlyLearn Logo" 
            className="h-12 mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">Welcome to SIPlyLearn</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose your learning domains to personalize your experience. 
            Select multiple domains that interest you - you can always update these preferences later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {domains.map(domain => (
            <Card
              key={domain.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden ${
                selectedDomains.includes(domain.id)
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => toggleDomain(domain.id)}
            >
              {selectedDomains.includes(domain.id) && (
                <div className="absolute top-4 right-4">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
              <div className="text-4xl mb-4">{domain.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{domain.name}</h3>
              <p className="text-muted-foreground">{domain.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="px-8"
            disabled={selectedDomains.length === 0}
            onClick={handleContinue}
          >
            Continue to Dashboard
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            You can always change your preferences later from your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}