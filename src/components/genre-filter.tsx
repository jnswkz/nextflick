"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from 'next/navigation';

export default function GenreFilter({ genres }: { genres: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSelectGenre = (genre: string) => {
    const params = new URLSearchParams(searchParams);
    if (genre === 'all') {
      params.delete('genre');
    } else {
      params.set('genre', genre);
    }
    
    // Preserve search query if it exists
    const query = searchParams.get('q');
    if (query) {
        params.set('q', query);
    } else {
        params.delete('q');
    }

    router.push(`/search?${params.toString()}`);
  }

  return (
    <Select onValueChange={onSelectGenre} defaultValue={searchParams.get('genre') || 'all'}>
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder="Filter by genre..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Genres</SelectItem>
        {genres.map((genre) => (
          <SelectItem key={genre} value={genre}>
            {genre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
