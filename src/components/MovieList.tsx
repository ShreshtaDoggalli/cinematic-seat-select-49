import React from 'react';
import { Movie } from '@/types';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  title: string;
  onViewDetails: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, title, onViewDetails }) => {
  if (movies.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No movies available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 animate-slide-in">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MovieCard movie={movie} onViewDetails={onViewDetails} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieList;