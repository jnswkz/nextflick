import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getMovies } from "@/lib/movies";
import MovieCard from "@/components/movie-card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import FilmDetailActions from "@/components/film-detail-actions";

export default function HomePage() {
  const allMovies = getMovies();
  const newReleases = [...allMovies].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 10);
  const topRated = [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const featuredMovie = allMovies.find(m => m.featured) || allMovies[0];

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[60vh] md:h-[75vh] w-full">
          <Image
            src={featuredMovie.posterUrl}
            alt={`Poster for ${featuredMovie.title}`}
            fill
            className="object-cover"
            data-ai-hint={featuredMovie.posterHint}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="container max-w-screen-2xl h-full flex flex-col justify-end pb-8 md:pb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg text-primary-foreground">
              {featuredMovie.title}
            </h1>
            <p className="max-w-xl mt-4 text-md md:text-lg text-primary-foreground/90 drop-shadow-md hidden md:block">
              {featuredMovie.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <Link href={`/films/${featuredMovie.id}`}>
                <Button size="lg">
                  <PlayCircle className="mr-2 h-6 w-6" />
                  Play
                </Button>
              </Link>
              <FilmDetailActions movie={featuredMovie} />
            </div>
          </div>
        </div>
      )}

      <div className="container max-w-screen-2xl space-y-12 mb-12">
        <section>
          <h2 className="text-3xl font-bold font-headline mb-4">New Releases</h2>
          <Carousel opts={{ align: "start", dragFree: true }}>
            <CarouselContent className="-ml-4">
              {newReleases.map((movie) => (
                <CarouselItem key={movie.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[15%] pl-4">
                  <MovieCard movie={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>

        <section>
          <h2 className="text-3xl font-bold font-headline mb-4">Top Rated</h2>
          <Carousel opts={{ align: "start", dragFree: true }}>
            <CarouselContent className="-ml-4">
              {topRated.map((movie) => (
                <CarouselItem key={movie.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[15%] pl-4">
                  <MovieCard movie={movie} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>
      </div>
    </div>
  );
}
