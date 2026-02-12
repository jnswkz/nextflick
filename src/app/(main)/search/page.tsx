"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Movie } from "@/lib/movies";
import MovieCard from "@/components/movie-card";
import GenreFilter from "@/components/genre-filter";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const genre = searchParams.get("genre");

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams();

        if (query) {
          params.set("q", query);
        }

        if (genre) {
          params.set("genre", genre);
        }

        const url = params.toString() ? `/api/films?${params.toString()}` : "/api/films";
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Failed to load films.");
        }

        const payload = (await response.json()) as { films: Movie[]; genres: string[] };
        setMovies(payload.films || []);
        setGenres(payload.genres || []);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(error);
        setMovies([]);
        setGenres([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchMovies();

    return () => controller.abort();
  }, [genre, query]);

  const getTitle = () => {
    if (query && genre) return `Results for "${query}" in ${genre}`;
    if (query) return `Search results for "${query}"`;
    if (genre) return `Films in ${genre}`;
    return "Explore All Films";
  };

  return (
    <div className="container max-w-screen-2xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline">{getTitle()}</h1>
        <GenreFilter genres={genres} />
      </div>
      {isLoading ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
          <p className="text-lg text-muted-foreground">Loading films...</p>
        </div>
      ) : null}
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : !isLoading ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
          <p className="text-lg text-muted-foreground">No films found matching your criteria.</p>
        </div>
      ) : null}
    </div>
  );
}
