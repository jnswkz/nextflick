"use client";

import { useWatchlist } from "@/contexts/watchlist-context";
import type { Movie } from "@/lib/movies";
import WatchlistButton from "./watchlist-button";

export default function FilmDetailActions({ movie }: { movie: Movie }) {
    const { isInWatchlist } = useWatchlist();
    const inWatchlist = isInWatchlist(movie.id);

    return (
        <WatchlistButton movie={movie} size="lg" variant={inWatchlist ? "default" : "outline"}>
            <span className="ml-2">{inWatchlist ? 'On my Watchlist' : 'Add to Watchlist'}</span>
        </WatchlistButton>
    )
}
