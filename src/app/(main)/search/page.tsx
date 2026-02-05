"use client";

import { useSearchParams } from 'next/navigation';
import { getMovies, genres } from '@/lib/movies';
import MovieCard from '@/components/movie-card';
import { Suspense } from 'react';
import GenreFilter from '@/components/genre-filter';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const genre = searchParams.get('genre');

  const movies = getMovies(query, genre);

  const getTitle = () => {
    if (query && genre) return `Results for "${query}" in ${genre}`;
    if (query) return `Search results for "${query}"`;
    if (genre) return `Films in ${genre}`;
    return 'Explore All Films';
  }

  return (
    <div className="container max-w-screen-2xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline">{getTitle()}</h1>
        <GenreFilter genres={genres} />
      </div>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
          <p className="text-lg text-muted-foreground">No films found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="container max-w-screen-2xl mx-auto py-8">Loading search results...</div>}>
            <SearchResults />
        </Suspense>
    )
}
