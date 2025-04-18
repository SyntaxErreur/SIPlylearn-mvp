import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

export default function CommunityCounter() {
  const { data: communityCount, isLoading } = useQuery({
    queryKey: ["community-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error fetching community count:", error);
        throw error;
      }

      return count || 0;
    },
    staleTime: 15 * 60 * 1000,
  });
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };
  let displayCount;
  if (isLoading) {
    displayCount = (
      <div className="flex items-center">
        <div className="loader" />{" "}
        {/* Add a loader class with styles for animation */}
        <span className="ml-2">Loading...</span>
      </div>
    );
  } else {
    displayCount = formatCount(communityCount === null ? 0 : communityCount);
  }
  return (
    <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm bg-primary/5 px-3 py-1 rounded-full">
      <Users className="h-4 w-4 text-primary" />
      <span className="font-medium">
        {isLoading ? displayCount : displayCount}
      </span>
      <span className="text-muted-foreground">Community Members</span>
    </div>
  );
}
