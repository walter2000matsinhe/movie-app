// TrailerFetcher.js
import { useState, useEffect } from 'react';

// Same API options as your App.js
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZmMyMzAyODczZDYwODMwODliMDA1ZjlmOTU2MmIwMyIsIm5iZiI6MTc0NjM1Nzc0NC4zMjksInN1YiI6IjY4MTc0ZGYwNzVkYTdhZjcxYTA4OWYzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6T47Yd6tHK11mhYgHcRrysMiSI6Weg-AOqtXnT--Vyo'
  }
};

export const useMovieTrailer = (movieId) => {
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchTrailer = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch videos associated with the movie
        const response = await fetch(
          `${API_BASE_URL}/movie/${movieId}/videos`, 
          API_OPTIONS
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch trailer data');
        }

        const data = await response.json();
        
        // Look for official trailers first
        let trailer = data.results.find(
          video => video.type === 'Trailer' && video.official === true && video.site === 'YouTube'
        );

        // If no official trailer, look for any trailer
        if (!trailer) {
          trailer = data.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
          );
        }

        // If still no trailer, look for any teaser
        if (!trailer) {
          trailer = data.results.find(
            video => video.type === 'Teaser' && video.site === 'YouTube'
          );
        }

        // If we found a trailer, construct the YouTube URL
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
        } else {
          setTrailerUrl(''); // No trailer found
        }
      } catch (err) {
        console.error('Error fetching trailer:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailer();
  }, [movieId]);

  return { trailerUrl, isLoading, error };
};