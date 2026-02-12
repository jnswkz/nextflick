export type Movie = {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  posterHint: string;
  releaseYear: number;
  genres: string[];
  rating: number;
  actors: string[];
  magnetLink: string;
  featured?: boolean;
};

export const filterMovies = (
  movies: Movie[],
  query?: string | null,
  genre?: string | null
) => {
  let filteredMovies = movies;

  if (genre) {
    filteredMovies = filteredMovies.filter((movie) => movie.genres.includes(genre));
  }

  if (query) {
    const lowercasedQuery = query.toLowerCase();
    filteredMovies = filteredMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowercasedQuery) ||
        movie.actors.some((actor) => actor.toLowerCase().includes(lowercasedQuery)) ||
        movie.genres.some((g) => g.toLowerCase().includes(lowercasedQuery))
    );
  }

  return filteredMovies;
};

export const getGenres = (movies: Movie[]) => {
  return [...new Set(movies.flatMap((movie) => movie.genres))].sort();
};
