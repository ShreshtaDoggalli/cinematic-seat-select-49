// TypeScript interfaces for the movie booking application

export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number; // in minutes
  rating: number; // average rating out of 5
  totalRatings: number;
  language: string;
  poster: string;
  description: string;
  isUpcoming: boolean;
  releaseDate: string;
  trailer?: string;
}

export interface ShowTime {
  id: string;
  movieId: string;
  date: string;
  time: string;
  screenId: string;
  screenName: string;
  availableSeats: number;
  totalSeats: number;
  pricing: {
    regular: number;
    premium: number;
  };
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'regular' | 'premium';
  status: 'available' | 'booked' | 'selected';
  price: number;
}

export interface Screen {
  id: string;
  name: string;
  seats: Seat[][];
  rows: number;
  seatsPerRow: number;
}

export interface BookingDetails {
  movieId: string;
  showTimeId: string;
  selectedSeats: Seat[];
  totalAmount: number;
  userRating?: number;
}

export interface UserRating {
  movieId: string;
  userId: string;
  rating: number;
  review?: string;
  timestamp: string;
}

// API Response types
export interface MoviesResponse {
  currentMovies: Movie[];
  upcomingMovies: Movie[];
}

export interface ShowTimesResponse {
  movieId: string;
  showTimes: ShowTime[];
}

export interface SeatsResponse {
  showTimeId: string;
  screen: Screen;
}

export interface BookingResponse {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'failed';
  bookingDetails: BookingDetails;
  timestamp: string;
}