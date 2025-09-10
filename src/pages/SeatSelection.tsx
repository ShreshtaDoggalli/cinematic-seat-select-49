import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Seat } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SeatMap from '@/components/SeatMap';
import { useBooking } from '@/context/BookingContext';
import { fetchSeats } from '@/data/mockData';
import { ArrowLeft, Loader2, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SeatSelection: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, selectSeat, deselectSeat, getTotalAmount, setStep } = useBooking();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.selectedMovie || !state.selectedShowTime) {
      navigate('/');
      return;
    }

    const loadSeats = async () => {
      try {
        const screenData = await fetchSeats(state.selectedShowTime!.id);
        setScreen(screenData);
      } catch (error) {
        console.error('Failed to fetch seats:', error);
        toast({
          title: "Error",
          description: "Failed to load seat information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [state.selectedMovie, state.selectedShowTime, navigate, toast]);

  const handleSeatSelect = (seat: Seat) => {
    const isSelected = state.selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      deselectSeat(seat.id);
    } else {
      if (state.selectedSeats.length >= 10) {
        toast({
          title: "Seat Limit Reached",
          description: "You can select maximum 10 seats at a time.",
          variant: "destructive",
        });
        return;
      }
      selectSeat(seat);
    }
  };

  const handleProceedToSummary = () => {
    if (state.selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setStep('summary');
    navigate('/summary');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cinema-red mx-auto mb-4" />
          <p className="text-muted-foreground">Loading seats...</p>
        </div>
      </div>
    );
  }

  if (!state.selectedMovie || !state.selectedShowTime || !screen) {
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
              onClick={() => navigate(`/movie/${state.selectedMovie?.id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-foreground">Select Seats</h1>
              <p className="text-sm text-muted-foreground">Choose your preferred seats</p>
            </div>
            
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Movie & Show Info */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-center">
              {state.selectedMovie.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(state.selectedShowTime.time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{state.selectedShowTime.screenName}</span>
              </div>
              <div className="text-sm">
                {new Date(state.selectedShowTime.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seat Map */}
        <div className="animate-fade-in">
          <SeatMap
            seats={screen.seats}
            onSeatSelect={handleSeatSelect}
            selectedSeats={state.selectedSeats}
          />
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
          <div className="container mx-auto max-w-2xl">
            {state.selectedSeats.length > 0 ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {state.selectedSeats.length} seat{state.selectedSeats.length > 1 ? 's' : ''} selected
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total: <span className="text-cinema-gold font-bold">₹{getTotalAmount()}</span>
                  </div>
                </div>
                <Button
                  variant="book"
                  size="lg"
                  onClick={handleProceedToSummary}
                  className="animate-pulse-glow"
                >
                  Proceed to Payment
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">Select seats to continue</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacing for fixed button */}
        <div className="h-24"></div>
      </div>
    </div>
  );
};

export default SeatSelection;