import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, Home, Ticket, CalendarDays, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { state, resetBooking } = useBooking();

  const handleNewBooking = () => {
    resetBooking();
    navigate('/');
  };

  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    const ticketData = {
      movieTitle: state.selectedMovie?.title,
      showTime: state.selectedShowTime?.time,
      date: state.selectedShowTime?.date,
      screen: state.selectedShowTime?.screenName,
      seats: state.selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', '),
      totalAmount: state.selectedSeats.reduce((total, seat) => total + seat.price, 0),
      bookingId: `BK${Date.now()}`,
    };
    
    console.log('Downloading ticket:', ticketData);
    // Navigate to QR code page after download
    navigate('/qr-code');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!state.bookingDetails || !state.selectedMovie || !state.selectedShowTime) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Booking Found</h1>
          <p className="text-muted-foreground mb-6">Please make a booking first.</p>
          <Button onClick={() => navigate('/')} variant="cinema">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const regularSeats = state.selectedSeats.filter(seat => seat.type === 'regular');
  const premiumSeats = state.selectedSeats.filter(seat => seat.type === 'premium');
  const totalAmount = state.selectedSeats.reduce((total, seat) => total + seat.price, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/summary')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-foreground">Booking Confirmed</h1>
              <p className="text-sm text-muted-foreground">Your reservation is complete</p>
            </div>
            
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 animate-fade-in">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Your tickets have been successfully booked
            </p>
          </div>

          {/* Booking Details */}
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-cinema-gold" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking ID */}
              <div className="text-center p-4 bg-cinema-grey rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
                <p className="text-2xl font-bold text-cinema-gold">BK{Date.now()}</p>
              </div>

              {/* Movie Info */}
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
                  <p className="text-sm text-muted-foreground">{state.selectedMovie.language}</p>
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
                <h4 className="font-semibold text-foreground">Your Seats</h4>
                
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
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Paid</span>
                <span className="text-cinema-gold">₹{totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadTicket}
              className="flex-1 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Ticket
            </Button>
            <Button
              variant="cinema"
              size="lg"
              onClick={handleNewBooking}
              className="flex-1 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Book Another Movie
            </Button>
          </div>

          {/* Instructions */}
          <Card className="mt-8 animate-fade-in">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Important Instructions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Please arrive at the cinema at least 15 minutes before the show time</li>
                <li>• Carry a valid ID proof for verification</li>
                <li>• Download or take a screenshot of this booking confirmation</li>
                <li>• Outside food and beverages are not allowed</li>
                <li>• Tickets are non-refundable and non-transferable</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;