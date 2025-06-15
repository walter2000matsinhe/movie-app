import React from 'react';
import { useMovieTrailer } from './TrailerFetcher';

const WatchMovies = ({ movie, onBack }) => {
  const { trailerUrl, isLoading, error } = useMovieTrailer(movie?.id);

  return (
    <section className="wrapper">
      <button
        onClick={onBack}
        className="text-sm text-light-100 hover:underline mb-6"
      >
        ← Back to Browse
      </button>

      <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg shadow-light-100/10 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
          <p className="text-sm text-gray-100">{movie.overview}</p>
        </div>

        {isLoading && <p className="text-light-100">Loading trailer...</p>}
        {error && <p className="text-red-500">Error loading trailer: {error}</p>}

        {trailerUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl shadow-inner shadow-light-100/20 border border-light-100/30">
            <iframe
              src={trailerUrl}
              title="YouTube Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          !isLoading && (
            <p className="text-gray-300 italic">No trailer available for this movie.</p>
          )
        )}
      </div>
    </section>
  );
};

export default WatchMovies;
