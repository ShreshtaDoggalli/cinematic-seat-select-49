import React, { useEffect, useState } from 'react';
import { Movie } from '@/types';
import MovieList from '@/components/MovieList';
import { fetchMovies } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Loader2, Film, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movieData = await fetchMovies();
        setMovies(movieData);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleViewDetails = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const currentMovies = movies.filter(movie => !movie.isUpcoming);
  const upcomingMovies = movies.filter(movie => movie.isUpcoming);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cinema-red mx-auto mb-4" />
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Auth */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-cinema-gold" />
              <h1 className="text-2xl font-bold text-foreground">
                Cinema <span className="text-cinema-gold">Booking</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  Login / Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Film className="w-12 h-12 text-cinema-gold" />
            <h1 className="text-5xl font-bold text-foreground animate-fade-in">
              Cinema <span className="text-cinema-gold">Booking</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-in">
            Book your favorite movies with ease. Premium seats, great prices!
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cinema-red rounded-full" />
              <span>Regular ₹200</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cinema-gold rounded-full" />
              <span>Premium ₹250</span>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <main className="container mx-auto px-4 py-12">
        <MovieList
          movies={currentMovies}
          title="Now Playing"
          onViewDetails={handleViewDetails}
        />
        
        <MovieList
          movies={upcomingMovies}
          title="Coming Soon"
          onViewDetails={handleViewDetails}
        />
      </main>

      {/* Footer */}
      <footer className="bg-card py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Cinema Booking. Book your entertainment, create memories.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Home;