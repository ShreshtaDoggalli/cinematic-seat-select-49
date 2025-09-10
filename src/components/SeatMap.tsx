import React from 'react';
import { Seat } from '@/types';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/context/BookingContext';

interface SeatMapProps {
  seats: Seat[][];
  onSeatSelect: (seat: Seat) => void;
  selectedSeats: Seat[];
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, onSeatSelect, selectedSeats }) => {
  const { state } = useBooking();

  const getSeatStatus = (seat: Seat) => {
    if (seat.status === 'booked') return 'booked';
    if (selectedSeats.some(s => s.id === seat.id)) return 'selected';
    return seat.status;
  };

  const getSeatColor = (seat: Seat) => {
    const status = getSeatStatus(seat);
    
    switch (status) {
      case 'booked':
        return 'bg-seat-booked cursor-not-allowed relative';
      case 'selected':
        return 'bg-seat-selected text-foreground hover:bg-seat-selected';
      default:
        return seat.type === 'premium' 
          ? 'bg-seat-premium text-cinema-black hover:bg-cinema-gold-hover'
          : 'bg-seat-available text-foreground hover:bg-cinema-light-grey';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    onSeatSelect(seat);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Screen */}
      <div className="mb-8">
        <div className="w-full h-4 bg-gradient-secondary rounded-full mb-2 shadow-lg" />
        <p className="text-center text-muted-foreground text-sm">Screen</p>
      </div>

      {/* Seat Legend */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-card rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-available" />
          <span className="text-sm">Regular (₹200)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-premium" />
          <span className="text-sm">Premium (₹250)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-selected" />
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-seat-booked" />
          <span className="text-sm">Booked</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="space-y-3">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center items-center gap-2">
            {/* Row Label */}
            <div className="w-8 text-center text-muted-foreground font-semibold">
              {row[0]?.row}
            </div>
            
            {/* Seats */}
            <div className="flex gap-2">
              {row.map((seat, seatIndex) => (
                <React.Fragment key={seat.id}>
                  {/* Add aisle space after seat 3 and 6 */}
                  {seatIndex === 3 && <div className="w-4" />}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`w-8 h-8 rounded text-xs font-semibold transition-all duration-200 ${getSeatColor(seat)} ${
                      getSeatStatus(seat) === 'selected' ? 'scale-110 shadow-lg' : ''
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === 'booked'}
                  >
                    {seat.number}
                    {/* Slant line for booked seats */}
                    {seat.status === 'booked' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-0.5 bg-red-500 rotate-45" />
                      </div>
                    )}
                  </Button>
                </React.Fragment>
              ))}
            </div>
            
            {/* Row Label (Right) */}
            <div className="w-8 text-center text-muted-foreground font-semibold">
              {row[0]?.row}
            </div>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-8 p-4 bg-card rounded-lg border border-cinema-red">
          <h3 className="font-semibold text-foreground mb-2">Selected Seats</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map(seat => (
              <span
                key={seat.id}
                className="px-3 py-1 bg-cinema-red text-foreground rounded-full text-sm font-semibold"
              >
                {seat.row}{seat.number}
              </span>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
            </span>
            <span className="text-lg font-bold text-cinema-gold">
              ₹{selectedSeats.reduce((total, seat) => total + seat.price, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;