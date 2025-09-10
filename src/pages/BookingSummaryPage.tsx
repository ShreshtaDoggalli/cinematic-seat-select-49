import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BookingSummary from '@/components/BookingSummary';
import { useBooking } from '@/context/BookingContext';
import { ArrowLeft } from 'lucide-react';

const BookingSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useBooking();

  const handleConfirmBooking = () => {
    navigate('/payment');
  };

  if (!state.selectedMovie || !state.selectedShowTime || state.selectedSeats.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Session Expired</h1>
          <p className="text-muted-foreground mb-6">Please start your booking again.</p>
          <Button onClick={() => navigate('/')} variant="cinema">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/seats')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Seats
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-foreground">Review Booking</h1>
              <p className="text-sm text-muted-foreground">Confirm your details</p>
            </div>
            
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <BookingSummary onConfirmBooking={handleConfirmBooking} />
      </div>
    </div>
  );
};

export default BookingSummaryPage;