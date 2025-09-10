import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, MapPin, Ticket, Star } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { submitBooking } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface BookingSummaryProps {
  onConfirmBooking: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ onConfirmBooking }) => {
  const { state, confirmBooking, getTotalAmount } = useBooking();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = React.useState(false);

  const handleConfirmBooking = async () => {
    if (!state.selectedMovie || !state.selectedShowTime || state.selectedSeats.length === 0) {
      return;
    }

    setIsBooking(true);
    
    try {
      const bookingDetails = {
        movieId: state.selectedMovie.id,
        showTimeId: state.selectedShowTime.id,
        selectedSeats: state.selectedSeats,
        totalAmount: getTotalAmount(),
      };

      const response = await submitBooking(bookingDetails);
      
      confirmBooking(bookingDetails);
      onConfirmBooking();
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking ID is ${response.bookingId}`,
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!state.selectedMovie || !state.selectedShowTime || state.selectedSeats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Please select a movie, showtime, and seats to continue.</p>
      </div>
    );
  }

  const regularSeats = state.selectedSeats.filter(seat => seat.type === 'regular');
  const premiumSeats = state.selectedSeats.filter(seat => seat.type === 'premium');
  const totalAmount = getTotalAmount();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Movie Information */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-cinema-gold" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <img
              src={state.selectedMovie.poster}
              alt={state.selectedMovie.title}
              className="w-24 h-36 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/96x144/1a1a1a/ffffff?text=${encodeURIComponent(state.selectedMovie.title)}`;
              }}
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-bold text-foreground">{state.selectedMovie.title}</h3>
              <p className="text-muted-foreground">{state.selectedMovie.genre}</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-cinema-gold text-cinema-gold" />
                <span className="text-sm">{state.selectedMovie.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({state.selectedMovie.totalRatings} reviews)
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Show Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-cinema-gold" />
              <span className="font-semibold">{formatDate(state.selectedShowTime.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cinema-gold" />
              <span className="font-semibold">{formatTime(state.selectedShowTime.time)}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-cinema-gold" />
              <span className="font-semibold">{state.selectedShowTime.screenName}</span>
            </div>
          </div>

          <Separator />

          {/* Seat Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Selected Seats</h4>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {state.selectedSeats.map(seat => (
                <span
                  key={seat.id}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    seat.type === 'premium' 
                      ? 'bg-cinema-gold text-cinema-black'
                      : 'bg-cinema-red text-foreground'
                  }`}
                >
                  {seat.row}{seat.number}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              {regularSeats.length > 0 && (
                <div className="flex justify-between">
                  <span>Regular Seats ({regularSeats.length})</span>
                  <span>₹{regularSeats.length * 200}</span>
                </div>
              )}
              {premiumSeats.length > 0 && (
                <div className="flex justify-between">
                  <span>Premium Seats ({premiumSeats.length})</span>
                  <span>₹{premiumSeats.length * 250}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-cinema-gold">₹{totalAmount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Button
          variant="book"
          size="lg"
          className="flex-1"
          onClick={handleConfirmBooking}
          disabled={isBooking}
        >
          {isBooking ? 'Processing...' : `Confirm Booking - ₹${totalAmount}`}
        </Button>
      </div>
    </div>
  );
};

export default BookingSummary;