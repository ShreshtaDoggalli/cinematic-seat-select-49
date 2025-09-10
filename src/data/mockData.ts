import { Movie, ShowTime, Screen, Seat } from '@/types';

// Mock movie data
export const mockMovies: Movie[] = [
  // Currently Running Movies
  {
    id: '1',
    title: 'Su from So',
    genre: 'Drama, Romance',
    duration: 145,
    rating: 4.2,
    totalRatings: 1250,
    language: 'Tamil',
    poster: '/lovable-uploads/f7f82823-e431-43d8-80b9-2b83f5c1b3ef.png',
    description: 'A heartwarming tale of love and relationships set in contemporary Tamil Nadu.',
    isUpcoming: false,
    releaseDate: '2024-11-15',
  },
  {
    id: '2',
    title: 'The Conjuring: Last Rites',
    genre: 'Horror, Supernatural',
    duration: 112,
    rating: 4.5,
    totalRatings: 2100,
    language: 'English',
    poster: '/lovable-uploads/aa1aafff-c147-4942-939b-3ec0624259f6.png',
    description: 'The final chapter in the Conjuring series brings the most terrifying supernatural encounters yet.',
    isUpcoming: false,
    releaseDate: '2024-11-20',
  },
  {
    id: '3',
    title: 'F1 The Movie',
    genre: 'Action, Sports',
    duration: 135,
    rating: 4.0,
    totalRatings: 890,
    language: 'English',
    poster: '/lovable-uploads/321ab562-855d-48e6-b7d8-4a7a4d47c245.png',
    description: 'High-octane racing action featuring real Formula 1 circuits and drivers.',
    isUpcoming: false,
    releaseDate: '2024-11-10',
  },
  {
    id: '4',
    title: 'Paramsundari',
    genre: 'Comedy, Drama',
    duration: 128,
    rating: 3.8,
    totalRatings: 670,
    language: 'Malayalam',
    poster: '/lovable-uploads/4dd6556c-2b68-4035-8228-0041526432a7.png',
    description: 'A lighthearted comedy-drama about family values and modern relationships.',
    isUpcoming: false,
    releaseDate: '2024-11-18',
  },
  {
    id: '5',
    title: 'Coolie',
    genre: 'Action, Thriller',
    duration: 152,
    rating: 4.3,
    totalRatings: 1890,
    language: 'Tamil',
    poster: '/lovable-uploads/b1f7f6cd-57f4-4eeb-b7ab-d43bf8d3a8a7.png',
    description: 'An action-packed thriller featuring spectacular stunts and an engaging storyline.',
    isUpcoming: false,
    releaseDate: '2024-11-12',
  },
  {
    id: '6',
    title: 'Lokah',
    genre: 'Drama, Fantasy',
    duration: 140,
    rating: 4.1,
    totalRatings: 1120,
    language: 'Hindi',
    poster: '/lovable-uploads/bf68228d-ecaa-433c-9eea-6d49136a5b61.png',
    description: 'A mystical journey exploring the boundaries between reality and fantasy.',
    isUpcoming: false,
    releaseDate: '2024-11-22',
  },
  
  // Upcoming Movies
  {
    id: '7',
    title: 'Demon Slayers: Infinity Castle',
    genre: 'Animation, Action',
    duration: 125,
    rating: 0,
    totalRatings: 0,
    language: 'Japanese',
    poster: '/lovable-uploads/8a152c97-4877-4e79-8b25-252ee4b8f8fd.png',
    description: 'The highly anticipated continuation of the Demon Slayer saga in the Infinity Castle.',
    isUpcoming: true,
    releaseDate: '2025-02-14',
  },
  {
    id: '8',
    title: 'Kantara Chapter 1',
    genre: 'Action, Mythology',
    duration: 148,
    rating: 0,
    totalRatings: 0,
    language: 'Kannada',
    poster: '/lovable-uploads/0c7af18b-7b93-4b48-9790-d88c3a8b5912.png',
    description: 'The prequel to the blockbuster Kantara, exploring ancient folklore and traditions.',
    isUpcoming: true,
    releaseDate: '2025-01-25',
  },
  {
    id: '9',
    title: 'Avatar: The Fire and Ash',
    genre: 'Sci-Fi, Adventure',
    duration: 190,
    rating: 0,
    totalRatings: 0,
    language: 'English',
    poster: '/lovable-uploads/d6140c5d-2f05-4724-b525-88311e65294c.png',
    description: 'The third installment in James Cameron\'s Avatar saga, exploring new realms of Pandora.',
    isUpcoming: true,
    releaseDate: '2025-12-20',
  },
];

// Mock showtimes
export const mockShowTimes: ShowTime[] = [
  // Today's shows
  {
    id: 'st1',
    movieId: '1',
    date: '2024-12-10',
    time: '10:00',
    screenId: 'screen1',
    screenName: 'Screen 1',
    availableSeats: 85,
    totalSeats: 100,
    pricing: { regular: 200, premium: 250 },
  },
  {
    id: 'st2',
    movieId: '1',
    date: '2024-12-10',
    time: '14:30',
    screenId: 'screen2',
    screenName: 'Screen 2',
    availableSeats: 92,
    totalSeats: 100,
    pricing: { regular: 200, premium: 250 },
  },
  {
    id: 'st3',
    movieId: '2',
    date: '2024-12-10',
    time: '11:15',
    screenId: 'screen1',
    screenName: 'Screen 1',
    availableSeats: 78,
    totalSeats: 100,
    pricing: { regular: 200, premium: 250 },
  },
  {
    id: 'st4',
    movieId: '2',
    date: '2024-12-10',
    time: '19:00',
    screenId: 'screen3',
    screenName: 'Screen 3',
    availableSeats: 65,
    totalSeats: 100,
    pricing: { regular: 200, premium: 250 },
  },
  // Tomorrow's shows
  {
    id: 'st5',
    movieId: '3',
    date: '2024-12-11',
    time: '09:30',
    screenId: 'screen1',
    screenName: 'Screen 1',
    availableSeats: 95,
    totalSeats: 100,
    pricing: { regular: 200, premium: 250 },
  },
  {
    id: 'st6',
    movieId: '3',
    date: '2024-12-11',
    time: '16:45',
    screenId: 'screen2',
    screenName: 'Screen 2',
    availableSeats: 88,
    totalSeats: 100,
    pricing: { regular: 200, premium: 250 },
  },
];

// Generate mock seat layout
const generateSeatLayout = (rows: number, seatsPerRow: number): Seat[][] => {
  const seats: Seat[][] = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < rows; i++) {
    const row: Seat[] = [];
    const rowLabel = rowLabels[i];
    
    for (let j = 1; j <= seatsPerRow; j++) {
      const isPremium = i < 3; // First 3 rows are premium
      const isBooked = Math.random() < 0.15; // 15% chance of being booked
      
      row.push({
        id: `${rowLabel}${j}`,
        row: rowLabel,
        number: j,
        type: isPremium ? 'premium' : 'regular',
        status: isBooked ? 'booked' : 'available',
        price: isPremium ? 250 : 200,
      });
    }
    seats.push(row);
  }
  
  return seats;
};

// Mock screen data
export const mockScreen: Screen = {
  id: 'screen1',
  name: 'Screen 1',
  seats: generateSeatLayout(10, 10),
  rows: 10,
  seatsPerRow: 10,
};

// Mock API functions
export const fetchMovies = async (): Promise<Movie[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMovies;
};

export const fetchShowTimes = async (movieId: string): Promise<ShowTime[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockShowTimes.filter(st => st.movieId === movieId);
};

export const fetchSeats = async (showTimeId: string): Promise<Screen> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    ...mockScreen,
    seats: generateSeatLayout(10, 10), // Generate fresh layout each time
  };
};

export const submitBooking = async (bookingDetails: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    bookingId: `BK${Date.now()}`,
    status: 'confirmed',
    bookingDetails,
    timestamp: new Date().toISOString(),
  };
};

export const submitRating = async (movieId: string, rating: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Update mock data rating (in real app, this would update the database)
  const movie = mockMovies.find(m => m.id === movieId);
  if (movie) {
    const newTotalRatings = movie.totalRatings + 1;
    const newRating = ((movie.rating * movie.totalRatings) + rating) / newTotalRatings;
    movie.rating = Math.round(newRating * 10) / 10;
    movie.totalRatings = newTotalRatings;
  }
};