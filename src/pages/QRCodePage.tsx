import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home, Download, Share2 } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, resetBooking } = useBooking();

  const handleNewBooking = () => {
    resetBooking();
    navigate('/');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Movie Ticket',
        text: `My ticket for ${state.selectedMovie?.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Ticket link copied to clipboard!');
    }
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

  const bookingId = `BK${Date.now()}`;
  const qrData = JSON.stringify({
    bookingId,
    movieTitle: state.selectedMovie.title,
    showTime: state.selectedShowTime.time,
    date: state.selectedShowTime.date,
    screen: state.selectedShowTime.screenName,
    seats: state.selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', '),
    totalAmount: state.selectedSeats.reduce((total, seat) => total + seat.price, 0),
  });

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/confirmation')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-foreground">Your Ticket</h1>
              <p className="text-sm text-muted-foreground">Show this QR code at the cinema</p>
            </div>
            
            <div></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* QR Code Card */}
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-center">
                Digital Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <QRCodeSVG
                  value={qrData}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>

              {/* Booking Details */}
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">Booking ID</div>
                <div className="text-lg font-bold text-cinema-gold">{bookingId}</div>
              </div>

              <div className="space-y-3 text-center">
                <h3 className="font-bold text-xl text-foreground">{state.selectedMovie.title}</h3>
                <div className="text-muted-foreground">
                  <div>{formatDate(state.selectedShowTime.date)}</div>
                  <div>{formatTime(state.selectedShowTime.time)}</div>
                  <div>{state.selectedShowTime.screenName}</div>
                </div>
                <div className="text-foreground font-semibold">
                  Seats: {state.selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4 animate-fade-in">
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="w-full flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Ticket
            </Button>
            
            <Button
              variant="cinema"
              size="lg"
              onClick={handleNewBooking}
              className="w-full flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Book Another Movie
            </Button>
          </div>

          {/* Instructions */}
          <Card className="mt-8 animate-fade-in">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2 text-center">How to Use</h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Show this QR code to the staff at the cinema</li>
                <li>• Arrive 15 minutes before show time</li>
                <li>• Carry a valid ID for verification</li>
                <li>• Keep your phone charged or take a screenshot</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;