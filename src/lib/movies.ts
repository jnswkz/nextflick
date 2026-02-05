import { PlaceHolderImages } from './placeholder-images';

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
  videoUrl: string;
  featured?: boolean;
};

const getImageUrlAndHint = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return { 
        url: image ? image.imageUrl : 'https://picsum.photos/seed/error/500/750',
        hint: image ? image.imageHint : 'placeholder'
    };
}

export const movies: Movie[] = [
  {
    id: 'cosmic-odyssey',
    title: 'Cosmic Odyssey',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    posterUrl: getImageUrlAndHint('movie-poster-1').url,
    posterHint: getImageUrlAndHint('movie-poster-1').hint,
    releaseYear: 2024,
    genres: ['Sci-Fi', 'Adventure'],
    rating: 8.8,
    actors: ['Aria Vance', 'Leo Rex', 'Nova Chen'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featured: true,
  },
  {
    id: 'neon-blade',
    title: 'Neon Blade',
    description: 'In a dystopian future, a lone warrior fights to overthrow a corrupt regime.',
    posterUrl: getImageUrlAndHint('movie-poster-2').url,
    posterHint: getImageUrlAndHint('movie-poster-2').hint,
    releaseYear: 2023,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 7.9,
    actors: ['Jax Ryder', 'Cyra Kage', 'Orion Creed'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: 'the-last-stand',
    title: 'The Last Stand',
    description: 'A retired sheriff and his eclectic team must defend their small town from a ruthless outlaw.',
    posterUrl: getImageUrlAndHint('movie-poster-3').url,
    posterHint: getImageUrlAndHint('movie-poster-3').hint,
    releaseYear: 2021,
    genres: ['Western', 'Action'],
    rating: 7.5,
    actors: ['Colt Westwood', 'Ruby "Red" Harlow', 'Judge Gideon'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: 'echoes-of-time',
    title: 'Echoes of Time',
    description: 'A historian discovers a way to communicate with the past, but her actions have unforeseen consequences.',
    posterUrl: getImageUrlAndHint('movie-poster-4').url,
    posterHint: getImageUrlAndHint('movie-poster-4').hint,
    releaseYear: 2022,
    genres: ['Drama', 'Fantasy', 'Mystery'],
    rating: 8.2,
    actors: ['Elara Vance', 'Kaelen', 'Seraphina'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: 'deep-dive',
    title: 'Deep Dive',
    description: 'A group of marine biologists on a deep-sea expedition encounter a terrifying new species.',
    posterUrl: getImageUrlAndHint('movie-poster-5').url,
    posterHint: getImageUrlAndHint('movie-poster-5').hint,
    releaseYear: 2023,
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    rating: 6.9,
    actors: ['Dr. Aris Thorne', 'Mara Lowe', 'Kenji Tanaka'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: 'the-silent-city',
    title: 'The Silent City',
    description: 'In a world where noise can be deadly, a family must navigate a post-apocalyptic landscape in silence.',
    posterUrl: getImageUrlAndHint('movie-poster-6').url,
    posterHint: getImageUrlAndHint('movie-poster-6').hint,
    releaseYear: 2024,
    genres: ['Horror', 'Thriller', 'Drama'],
    rating: 9.1,
    actors: ['Evelyn Reed', 'Marcus Reed', 'Lena Reed'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
  {
    id: 'crimson-peak',
    title: 'Crimson Peak',
    description: 'A young author is swept away to a remote gothic mansion by a mysterious stranger.',
    posterUrl: getImageUrlAndHint('movie-poster-7').url,
    posterHint: getImageUrlAndHint('movie-poster-7').hint,
    releaseYear: 2015,
    genres: ['Horror', 'Fantasy', 'Romance'],
    rating: 6.5,
    actors: ['Edith Cushing', 'Sir Thomas Sharpe', 'Lady Lucille Sharpe'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
  {
    id: 'solar-flare',
    title: 'Solar Flare',
    description: 'As a solar flare threatens to wipe out all life on Earth, a team of astronauts embarks on a desperate mission.',
    posterUrl: getImageUrlAndHint('movie-poster-8').url,
    posterHint: getImageUrlAndHint('movie-poster-8').hint,
    releaseYear: 2024,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    rating: 8.5,
    actors: ['Captain Eva Rostova', 'Dr. Ben Carter', 'Commander Jax'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
  {
    id: 'the-alchemist',
    title: 'The Alchemist',
    description: 'A young shepherd named Santiago embarks on a journey to find a hidden treasure.',
    posterUrl: getImageUrlAndHint('movie-poster-9').url,
    posterHint: getImageUrlAndHint('movie-poster-9').hint,
    releaseYear: 2025,
    genres: ['Adventure', 'Drama', 'Fantasy'],
    rating: 9.0,
    actors: ['Santiago', 'The Alchemist', 'Fatima'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  },
  {
    id: 'heartstrings',
    title: 'Heartstrings',
    description: 'Two musicians from different worlds fall in love while collaborating on a song.',
    posterUrl: getImageUrlAndHint('movie-poster-10').url,
    posterHint: getImageUrlAndHint('movie-poster-10').hint,
    releaseYear: 2023,
    genres: ['Romance', 'Drama', 'Music'],
    rating: 7.8,
    actors: ['Chloe Park', 'Liam Evans', 'Isabella Rossi'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
  {
    id: 'jungle-beat',
    title: 'Jungle Beat',
    description: 'An unlikely group of animals must work together to save their jungle home from a greedy developer.',
    posterUrl: getImageUrlAndHint('movie-poster-11').url,
    posterHint: getImageUrlAndHint('movie-poster-11').hint,
    releaseYear: 2021,
    genres: ['Animation', 'Adventure', 'Comedy'],
    rating: 7.2,
    actors: ['Leo the Lion', 'Mika the Monkey', 'Zia the Zebra'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  },
  {
    id: 'cyber-war',
    title: 'Cyber War',
    description: 'A brilliant hacker uncovers a global conspiracy and becomes the target of a powerful organization.',
    posterUrl: getImageUrlAndHint('movie-poster-12').url,
    posterHint: getImageUrlAndHint('movie-poster-12').hint,
    releaseYear: 2022,
    genres: ['Action', 'Crime', 'Thriller'],
    rating: 8.1,
    actors: ['Alex "Glitch" Riley', 'Raven', 'Agent Thorne'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  },
];

export const genres = [...new Set(movies.flatMap(movie => movie.genres))].sort();

export const getMovies = (query?: string | null, genre?: string | null) => {
    let filteredMovies = movies;

    if (genre) {
        filteredMovies = filteredMovies.filter(movie => movie.genres.includes(genre));
    }
    
    if (query) {
        const lowercasedQuery = query.toLowerCase();
        filteredMovies = filteredMovies.filter(movie => 
            movie.title.toLowerCase().includes(lowercasedQuery) ||
            movie.actors.some(actor => actor.toLowerCase().includes(lowercasedQuery)) ||
            movie.genres.some(g => g.toLowerCase().includes(lowercasedQuery))
        );
    }
    return filteredMovies;
}

export const getMovieById = (id: string) => {
    return movies.find(movie => movie.id === id);
}
