import { NextRequest, NextResponse } from "next/server";
import { createMovie, listMovieGenres, listMovies } from "@/lib/server/film-store";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const genre = searchParams.get("genre");

  const [films, genres] = await Promise.all([listMovies(query, genre), listMovieGenres()]);

  return NextResponse.json({ films, genres });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const film = await createMovie(payload);
    return NextResponse.json(film, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create film.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
