"use client";

import { useToast } from "@/hooks/use-toast";
import type { Movie } from "@/lib/movies";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const { toast } = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem("cineview_watchlist");
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        localStorage.setItem("cineview_watchlist", JSON.stringify(watchlist));
      } catch (error) {
        console.error("Failed to save watchlist to localStorage", error);
      }
    }
  }, [watchlist, isInitialLoad]);

  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.find((item) => item.id === movie.id)) {
        return prev;
      }
      setTimeout(() => {
        toast({
          title: "Added to Watchlist",
          description: `${movie.title} has been added to your watchlist.`,
        });
      }, 0);
      return [movie, ...prev];
    });
  }, [toast]);

  const removeFromWatchlist = useCallback((movieId: string) => {
    setWatchlist((prev) => {
      const movieToRemove = prev.find(m => m.id === movieId);
      if (movieToRemove) {
        setTimeout(() => {
          toast({
            title: "Removed from Watchlist",
            description: `${movieToRemove.title} has been removed from your watchlist.`,
          });
        }, 0);
      }
      return prev.filter((item) => item.id !== movieId);
    });
  }, [toast]);

  const isInWatchlist = useCallback((movieId: string) => {
    return watchlist.some((item) => item.id === movieId);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
