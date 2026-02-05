import { getMovieById } from "@/lib/movies";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Users, Clapperboard } from "lucide-react";
import FilmDetailActions from "@/components/film-detail-actions";

function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl border border-border">
      <video
        src={src}
        controls
        className="w-full h-full"
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // transparent 1x1 pixel
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default function FilmDetailPage({ params }: { params: { id: string } }) {
  const movie = getMovieById(params.id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-8 md:py-12">
      <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
        <div className="md:col-span-4 lg:col-span-3">
          <Image
            src={movie.posterUrl}
            alt={`Poster for ${movie.title}`}
            width={500}
            height={750}
            className="rounded-lg shadow-xl w-full"
            data-ai-hint={movie.posterHint}
            priority
          />
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {movie.genres.map((genre) => (
              <Badge key={genre} variant="outline">{genre}</Badge>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">{movie.title}</h1>
          <div className="flex items-center gap-6 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-lg">{movie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold text-lg">{movie.releaseYear}</span>
            </div>
          </div>
          
          <p className="text-lg text-foreground/80 leading-relaxed mb-8 max-w-3xl">
            {movie.description}
          </p>

          <div className="space-y-4 mb-8 max-w-3xl">
              <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                  <div>
                      <h3 className="font-semibold">Starring</h3>
                      <p className="text-muted-foreground">{movie.actors.join(', ')}</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <Clapperboard className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                  <div>
                      <h3 className="font-semibold">Genres</h3>
                      <p className="text-muted-foreground">{movie.genres.join(', ')}</p>
                  </div>
              </div>
          </div>

          <div className="mb-8">
             <FilmDetailActions movie={movie} />
          </div>

          <VideoPlayer src={movie.videoUrl} />
        </div>
      </div>
    </div>
  );
}
