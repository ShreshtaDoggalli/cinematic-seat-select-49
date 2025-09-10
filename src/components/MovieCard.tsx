import React, { useState } from 'react';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, Calendar, Clock } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { submitRating } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface MovieCardProps {
  movie: Movie;
  onViewDetails: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onViewDetails }) => {
  const { selectMovie } = useBooking();
  const { toast } = useToast();
  const [userRating, setUserRating] = useState<number>(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const handleBookNow = () => {
    selectMovie(movie);
    onViewDetails(movie);
  };

  const handleRatingClick = async (rating: number) => {
    if (movie.isUpcoming) return;
    
    setUserRating(rating);
    setIsSubmittingRating(true);
    
    try {
      await submitRating(movie.id, rating);
      toast({
        title: "Rating Submitted",
        description: `You rated ${movie.title} ${rating} stars!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="group overflow-hidden bg-card hover:bg-cinema-grey transition-all duration-300 animate-fade-in">
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          {movie.isUpcoming ? (
            <span className="bg-cinema-gold text-cinema-black px-3 py-1 rounded-full text-sm font-semibold">
              Coming Soon
            </span>
          ) : (
            <div className="bg-black/70 text-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Star className="w-4 h-4 fill-cinema-gold text-cinema-gold" />
              {movie.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{movie.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">{movie.genre}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDuration(movie.duration)}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(movie.releaseDate).toLocaleDateString()}
          </div>
        </div>

        {!movie.isUpcoming && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Rate this movie:</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  disabled={isSubmittingRating}
                  className="transition-colors duration-200 disabled:opacity-50"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= userRating
                        ? 'fill-cinema-gold text-cinema-gold'
                        : 'text-muted-foreground hover:text-cinema-gold'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                ({movie.totalRatings} reviews)
              </span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(movie)}
          className="flex-1"
        >
          View Details
        </Button>
        {!movie.isUpcoming && (
          <Button
            variant="book"
            size="sm"
            onClick={handleBookNow}
            className="flex-1"
          >
            Book Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MovieCard;