import { useLocation } from "wouter";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

const domains = [
  {
    id: "finance",
    name: "Finance",
    description:
      "Master financial markets, saving strategies, and money management",
    icon: "💰",
  },
  {
    id: "tech",
    name: "Tech",
    description:
      "Learn programming, web development, and modern tech stack. Start building real-world applications now!",
    icon: "💻",
  },
  {
    id: "data-science",
    name: "Data Science",
    description:
      "Explore data analysis, machine learning, and AI applications. Dive deep into large datasets and find insights!",
    icon: "📊",
  },
  {
    id: "business",
    name: "Business",
    description:
      "Study business strategy, marketing, and entrepreneurship for real-world success.",
    icon: "💼",
  },
  {
    id: "language-learning",
    name: "Language Learning",
    description:
      "Master new languages for personal and professional growth. Become a polyglot!",
    icon: "🗣️",
  },
  {
    id: "social-science",
    name: "Social Science",
    description:
      "Understand human behavior, society, and cultural dynamics across the globe.",
    icon: "🌍",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    description:
      "Study algorithms, operating systems, and computer architecture in depth.",
    icon: "⚡",
  },
  {
    id: "personal-development",
    name: "Personal Development",
    description:
      "Enhance leadership, communication, and soft skills to boost your career and confidence.",
    icon: "🎯",
  },
];

const features = [
  {
    id: "save-money",
    title: "Save Money",
    description:
      "Cost-effective courses that help you invest in your future without overspending.",
    icon: "💸",
  },
  {
    id: "expert-instructors",
    title: "Expert Instructors",
    description: "Learn from professionals with real-world experience.",
    icon: "👨‍🏫",
  },
  {
    id: "interactive-content",
    title: "Interactive Content",
    description: "Engage with hands-on projects and interactive lessons.",
    icon: "💡",
  },
  {
    id: "personalized-learning",
    title: "Personalized Learning",
    description: "Tailor your learning journey to suit your goals.",
    icon: "🎯",
  },
  {
    id: "flexible-schedule",
    title: "Flexible Schedule",
    description: "Study at your own pace with self-paced courses.",
    icon: "⏰",
  },
];

export default function AdvertisementPage() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6 text-center">
        <img
          src="/SIPlyLearn-purple.png"
          alt="SIPlyLearn Logo"
          className="h-12 mx-auto mb-3"
        />
      </header>

      {/* Features Carousel */}
      <section className="container mx-auto px-4 py-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Why Choose Us?</h2>
        <div className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="flex-shrink-0 w-72 snap-center p-4 transition-all hover:shadow-lg"
            >
              <div className="text-5xl mb-3 text-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
        <p className="text-xs text-center mt-2 text-muted-foreground">
          Swipe to see all features
        </p>
      </section>

      {/* Domains Uniform Grid */}
      <section className="container mx-auto px-4 py-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Domains</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {domains.map((domain) => (
            <Card
              key={domain.id}
              className="h-48 flex flex-col justify-center items-center p-4 transition-all hover:shadow-lg cursor-default"
            >
              <div className="text-3xl mb-2">{domain.icon}</div>
              <h3 className="text-lg font-semibold text-center mb-1">
                {domain.name}
              </h3>
              {/* Truncate text if it overflows */}
              <p className="text-xs text-muted-foreground text-center line-clamp-3 overflow-hidden">
                {domain.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Call-to-Action */}
      <footer className="container mx-auto px-4 py-6 text-center">
        <Button size="lg" className="px-8" onClick={handleGetStarted}>
          Get Started Now
        </Button>
      </footer>
    </div>
  );
}
