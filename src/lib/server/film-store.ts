import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { filterMovies, getGenres, type Movie } from "@/lib/movies";

const DATA_PATH = path.join(process.cwd(), "data", "films.json");

type MovieInput = Omit<Movie, "id"> & { id?: string };

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `film-${Date.now()}`;

const ensureStoreExists = async () => {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });

  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, "[]", "utf8");
  }
};

const readMovies = async (): Promise<Movie[]> => {
  await ensureStoreExists();
  const raw = await fs.readFile(DATA_PATH, "utf8");

  try {
    const parsed = JSON.parse(raw.replace(/^\uFEFF/, "")) as Movie[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeMovies = async (movies: Movie[]) => {
  await ensureStoreExists();
  await fs.writeFile(DATA_PATH, JSON.stringify(movies, null, 2), "utf8");
};

export const listMovies = async (query?: string | null, genre?: string | null) => {
  const movies = await readMovies();
  return filterMovies(movies, query, genre);
};

export const listMovieGenres = async () => {
  const movies = await readMovies();
  return getGenres(movies);
};

export const getMovieById = async (id: string) => {
  const movies = await readMovies();
  return movies.find((movie) => movie.id === id);
};

const validateMovieInput = (movie: MovieInput) => {
  const requiredStringFields: Array<keyof MovieInput> = [
    "title",
    "description",
    "posterUrl",
    "posterHint",
    "magnetLink",
  ];

  for (const field of requiredStringFields) {
    if (!movie[field] || typeof movie[field] !== "string") {
      return `${field} is required and must be a string.`;
    }
  }

  if (!Array.isArray(movie.genres) || !movie.genres.every((genre) => typeof genre === "string")) {
    return "genres must be an array of strings.";
  }

  if (!Array.isArray(movie.actors) || !movie.actors.every((actor) => typeof actor === "string")) {
    return "actors must be an array of strings.";
  }

  if (typeof movie.releaseYear !== "number") {
    return "releaseYear must be a number.";
  }

  if (typeof movie.rating !== "number") {
    return "rating must be a number.";
  }

  return null;
};

export const createMovie = async (movieInput: MovieInput) => {
  const validationError = validateMovieInput(movieInput);
  if (validationError) {
    throw new Error(validationError);
  }

  const movies = await readMovies();
  let id = movieInput.id?.trim() || toSlug(movieInput.title);

  if (movies.some((movie) => movie.id === id)) {
    id = `${id}-${Date.now()}`;
  }

  const movie: Movie = {
    ...movieInput,
    id,
    featured: Boolean(movieInput.featured),
  };

  const nextMovies = [movie, ...movies];
  await writeMovies(nextMovies);

  return movie;
};

export const updateMovie = async (id: string, movieInput: Partial<Movie>) => {
  const movies = await readMovies();
  const index = movies.findIndex((movie) => movie.id === id);

  if (index === -1) {
    return null;
  }

  const nextMovie: Movie = {
    ...movies[index],
    ...movieInput,
    id,
  };

  const validationError = validateMovieInput(nextMovie);
  if (validationError) {
    throw new Error(validationError);
  }

  movies[index] = nextMovie;
  await writeMovies(movies);

  return nextMovie;
};

export const deleteMovie = async (id: string) => {
  const movies = await readMovies();
  const nextMovies = movies.filter((movie) => movie.id !== id);

  if (nextMovies.length === movies.length) {
    return false;
  }

  await writeMovies(nextMovies);
  return true;
};
