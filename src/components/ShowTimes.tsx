import React from 'react';
import { ShowTime } from '@/types';
import { Button } from '@/components/ui/button';
import { Clock, MapPin } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

interface ShowTimesProps {
  showTimes: ShowTime[];
  onSelectShowTime: (showTime: ShowTime) => void;
}

const ShowTimes: React.FC<ShowTimesProps> = ({ showTimes, onSelectShowTime }) => {
  const { selectShowTime, setStep } = useBooking();

  const handleShowTimeSelect = (showTime: ShowTime) => {
    selectShowTime(showTime);
    setStep('seats');
    onSelectShowTime(showTime);
  };

  // Group showtimes by date
  const groupedShowTimes = showTimes.reduce((acc, showTime) => {
    const date = showTime.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(showTime);
    return acc;
  }, {} as Record<string, ShowTime[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
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

  if (showTimes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No showtimes available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedShowTimes).map(([date, times]) => (
        <div key={date} className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-bold text-foreground">{formatDate(date)}</h3>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="grid gap-4">
            {times.map((showTime) => (
              <div
                key={showTime.id}
                className="p-4 bg-card rounded-lg border hover:border-cinema-red transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cinema-gold" />
                        <span className="text-lg font-semibold text-foreground">
                          {formatTime(showTime.time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{showTime.screenName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Available: {showTime.availableSeats}/{showTime.totalSeats}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        Regular ₹{showTime.pricing.regular} • Premium ₹{showTime.pricing.premium}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        showTime.availableSeats < 20 ? 'text-destructive' : 'text-cinema-gold'
                      }`}>
                        {showTime.availableSeats < 20 ? 'Fast Filling' : 'Available'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {showTime.availableSeats} seats left
                      </div>
                    </div>
                    
                    <Button
                      variant="book"
                      size="lg"
                      onClick={() => handleShowTimeSelect(showTime)}
                      disabled={showTime.availableSeats === 0}
                      className="min-w-24"
                    >
                      {showTime.availableSeats === 0 ? 'Sold Out' : 'Book'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowTimes;