import Link from "next/link";
import Image from "next/image";
import type { Movie } from "@/lib/movies";
import { Card, CardContent } from "@/components/ui/card";
import WatchlistButton from "./watchlist-button";
import { Star } from "lucide-react";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="w-full overflow-hidden group relative border-0 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 bg-card">
      <Link href={`/films/${movie.id}`} className="block">
        <CardContent className="p-0">
          <Image
            src={movie.posterUrl}
            alt={`Poster for ${movie.title}`}
            width={500}
            height={750}
            className="object-cover w-full h-auto aspect-[2/3]"
            data-ai-hint={movie.posterHint}
          />
        </CardContent>
      </Link>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 flex flex-col justify-end p-4 transform-gpu translate-y-4 group-hover:translate-y-0">
        <h3 className="font-bold text-lg text-primary-foreground">{movie.title}</h3>
        <p className="text-sm text-primary-foreground/80">{movie.genres.join(", ")}</p>
        <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-primary-foreground font-bold">{movie.rating}</span>
        </div>
      </div>
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 transform-gpu translate-x-4 group-hover:translate-x-0">
        <WatchlistButton movie={movie} />
      </div>
    </Card>
  );
}
