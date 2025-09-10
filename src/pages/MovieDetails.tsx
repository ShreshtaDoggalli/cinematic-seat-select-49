import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Movie, ShowTime } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ShowTimes from '@/components/ShowTimes';
import { mockMovies, fetchShowTimes, submitRating } from '@/data/mockData';
import { ArrowLeft, Star, Clock, Calendar, Globe, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTimesLoading, setShowTimesLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      
      const foundMovie = mockMovies.find(m => m.id === id);
      if (foundMovie) {
        setMovie(foundMovie);
        
        if (!foundMovie.isUpcoming) {
          setShowTimesLoading(true);
          try {
            const times = await fetchShowTimes(id);
            setShowTimes(times);
          } catch (error) {
            console.error('Failed to fetch showtimes:', error);
          } finally {
            setShowTimesLoading(false);
          }
        }
      }
      setLoading(false);
    };

    loadMovie();
  }, [id]);

  const handleRatingClick = async (rating: number) => {
    if (!movie || movie.isUpcoming) return;
    
    setUserRating(rating);
    setIsSubmittingRating(true);
    
    try {
      await submitRating(movie.id, rating);
      toast({
        title: "Rating Submitted",
        description: `You rated ${movie.title} ${rating} stars!`,
      });
      
      // Update local movie rating
      const newTotalRatings = movie.totalRatings + 1;
      const newRating = ((movie.rating * movie.totalRatings) + rating) / newTotalRatings;
      setMovie({
        ...movie,
        rating: Math.round(newRating * 10) / 10,
        totalRatings: newTotalRatings,
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

  const handleSelectShowTime = (showTime: ShowTime) => {
    navigate('/seats');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cinema-red mx-auto mb-4" />
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Movie Not Found</h1>
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
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Movie Hero */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full max-w-md mx-auto rounded-lg shadow-2xl animate-fade-in"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(movie.title)}`;
              }}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6 animate-slide-in">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{movie.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{movie.genre}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>{movie.language}</span>
                </div>
              </div>

              {/* Rating */}
              {!movie.isUpcoming && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-cinema-gold text-cinema-gold" />
                    <span className="text-2xl font-bold text-foreground">{movie.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({movie.totalRatings} reviews)</span>
                  </div>
                </div>
              )}

              <p className="text-foreground leading-relaxed text-lg">{movie.description}</p>
            </div>

            {/* User Rating */}
            {!movie.isUpcoming && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Rate this movie</h3>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        disabled={isSubmittingRating}
                        className="transition-colors duration-200 disabled:opacity-50 hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= userRating
                              ? 'fill-cinema-gold text-cinema-gold'
                              : 'text-muted-foreground hover:text-cinema-gold'
                          }`}
                        />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="ml-3 text-lg font-semibold text-foreground">
                        {userRating} star{userRating > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Show Times */}
        {!movie.isUpcoming && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-8">Show Times</h2>
            {showTimesLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cinema-red mx-auto mb-4" />
                <p className="text-muted-foreground">Loading showtimes...</p>
              </div>
            ) : (
              <ShowTimes showTimes={showTimes} onSelectShowTime={handleSelectShowTime} />
            )}
          </div>
        )}

        {/* Coming Soon Message */}
        {movie.isUpcoming && (
          <Card className="animate-fade-in">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Coming Soon</h2>
              <p className="text-muted-foreground text-lg mb-6">
                This movie will be released on {new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="text-cinema-gold font-semibold text-lg">
                Stay tuned for booking updates!
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;