import { Link, useLocation } from "wouter";
import { Home, Search, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const items = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: BookOpen, label: "My Courses", href: "/my-courses" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-16 md:hidden">
      <nav className="h-full max-w-md mx-auto px-4 flex items-center justify-around">
        {items.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href}>
            <a className={cn(
              "flex flex-col items-center gap-1",
              location === href ? "text-primary" : "text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
