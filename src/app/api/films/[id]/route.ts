import { NextRequest, NextResponse } from "next/server";
import { deleteMovie, getMovieById, updateMovie } from "@/lib/server/film-store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const film = await getMovieById(id);

  if (!film) {
    return NextResponse.json({ error: "Film not found." }, { status: 404 });
  }

  return NextResponse.json(film);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const film = await updateMovie(id, payload);

    if (!film) {
      return NextResponse.json({ error: "Film not found." }, { status: 404 });
    }

    return NextResponse.json(film);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update film.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const removed = await deleteMovie(id);

  if (!removed) {
    return NextResponse.json({ error: "Film not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
