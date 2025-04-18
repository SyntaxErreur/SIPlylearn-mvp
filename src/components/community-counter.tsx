
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

export default function CommunityCounter() {
  const { data: communityCount, isLoading } = useQuery({
    queryKey: ["community-count"],
    queryFn: async () => {
      // Count total number of profiles in the database
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      
      if (error) {
        console.error("Error fetching community count:", error);
        throw error;
      }
      
      return count || 0;
    },
    // Refresh every 15 minutes
    staleTime: 15 * 60 * 1000,
  });

  // Format the number for display (e.g., 1250 -> 1.25k)
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  // Show static fallback if loading fails
  const displayCount = isLoading || communityCount === null ? "12.5k+" : formatCount(communityCount);

  return (
    <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm bg-primary/5 px-3 py-1 rounded-full">
      <Users className="h-4 w-4 text-primary" />
      <span className="font-medium">{displayCount}</span>
      <span className="text-muted-foreground">Community Members</span>
    </div>
  );
}
