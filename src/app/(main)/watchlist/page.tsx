"use client";

import { useWatchlist } from "@/contexts/watchlist-context";
import MovieCard from "@/components/movie-card";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <div className="container max-w-screen-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold font-headline mb-8">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center gap-4 border-2 border-dashed border-border rounded-lg">
          <Bookmark className="w-16 h-16 text-muted-foreground/50" />
          <h2 className="text-2xl font-semibold">Your Watchlist is Empty</h2>
          <p className="text-lg text-muted-foreground max-w-md">Add films to your watchlist to see them here. Start by exploring our collection.</p>
          <Link href="/">
            <Button>Browse Films</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
