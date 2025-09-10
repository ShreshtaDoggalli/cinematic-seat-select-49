import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Movie, ShowTime, Seat, BookingDetails } from '@/types';

interface BookingState {
  selectedMovie: Movie | null;
  selectedShowTime: ShowTime | null;
  selectedSeats: Seat[];
  bookingDetails: BookingDetails | null;
  step: 'movies' | 'showtimes' | 'seats' | 'summary' | 'confirmation';
}

type BookingAction =
  | { type: 'SELECT_MOVIE'; payload: Movie }
  | { type: 'SELECT_SHOWTIME'; payload: ShowTime }
  | { type: 'SELECT_SEAT'; payload: Seat }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'CLEAR_SEATS' }
  | { type: 'SET_STEP'; payload: BookingState['step'] }
  | { type: 'CONFIRM_BOOKING'; payload: BookingDetails }
  | { type: 'RESET_BOOKING' };

const initialState: BookingState = {
  selectedMovie: null,
  selectedShowTime: null,
  selectedSeats: [],
  bookingDetails: null,
  step: 'movies',
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SELECT_MOVIE':
      return {
        ...state,
        selectedMovie: action.payload,
        selectedShowTime: null,
        selectedSeats: [],
        step: 'showtimes',
      };
    
    case 'SELECT_SHOWTIME':
      return {
        ...state,
        selectedShowTime: action.payload,
        selectedSeats: [],
        step: 'seats',
      };
    
    case 'SELECT_SEAT':
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.payload],
      };
    
    case 'DESELECT_SEAT':
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(seat => seat.id !== action.payload),
      };
    
    case 'CLEAR_SEATS':
      return {
        ...state,
        selectedSeats: [],
      };
    
    case 'SET_STEP':
      return {
        ...state,
        step: action.payload,
      };
    
    case 'CONFIRM_BOOKING':
      return {
        ...state,
        bookingDetails: action.payload,
        step: 'confirmation',
      };
    
    case 'RESET_BOOKING':
      return initialState;
    
    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  selectMovie: (movie: Movie) => void;
  selectShowTime: (showTime: ShowTime) => void;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSeats: () => void;
  setStep: (step: BookingState['step']) => void;
  confirmBooking: (details: BookingDetails) => void;
  resetBooking: () => void;
  getTotalAmount: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const selectMovie = (movie: Movie) => {
    dispatch({ type: 'SELECT_MOVIE', payload: movie });
  };

  const selectShowTime = (showTime: ShowTime) => {
    dispatch({ type: 'SELECT_SHOWTIME', payload: showTime });
  };

  const selectSeat = (seat: Seat) => {
    dispatch({ type: 'SELECT_SEAT', payload: seat });
  };

  const deselectSeat = (seatId: string) => {
    dispatch({ type: 'DESELECT_SEAT', payload: seatId });
  };

  const clearSeats = () => {
    dispatch({ type: 'CLEAR_SEATS' });
  };

  const setStep = (step: BookingState['step']) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const confirmBooking = (details: BookingDetails) => {
    dispatch({ type: 'CONFIRM_BOOKING', payload: details });
  };

  const resetBooking = () => {
    dispatch({ type: 'RESET_BOOKING' });
  };

  const getTotalAmount = (): number => {
    return state.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const value: BookingContextType = {
    state,
    dispatch,
    selectMovie,
    selectShowTime,
    selectSeat,
    deselectSeat,
    clearSeats,
    setStep,
    confirmBooking,
    resetBooking,
    getTotalAmount,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};