"use client";

import { useWatchlist } from "@/contexts/watchlist-context";
import type { Movie } from "@/lib/movies";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type WatchlistButtonProps = {
  movie: Movie;
} & Omit<ButtonProps, 'children'> & {children?: React.ReactNode};

export default function WatchlistButton({ movie, className, children, ...props }: WatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleWatchlist}
      className={cn("bg-background/70 hover:bg-background/90 text-foreground rounded-full data-[has-children=true]:rounded-md data-[has-children=true]:w-auto data-[has-children=true]:px-4", className)}
      {...props}
      aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      data-has-children={!!children}
    >
      {inWatchlist ? (
        <BookmarkCheck className="h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="h-5 w-5" />
      )}
      {children}
    </Button>
  );
}
