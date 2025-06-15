import React from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import WatchMovies from './components/WatchMovies';
import { useEffect,useState } from 'react';
import { useDebounce } from 'react-use';
import { updateSearchCount ,getTrendingMovies} from './appwrite';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZmMyMzAyODczZDYwODMwODliMDA1ZjlmOTU2MmIwMyIsIm5iZiI6MTc0NjM1Nzc0NC4zMjksInN1YiI6IjY4MTc0ZGYwNzVkYTdhZjcxYTA4OWYzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6T47Yd6tHK11mhYgHcRrysMiSI6Weg-AOqtXnT--Vyo'
  }
};
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState ([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedsearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [showWatchMovies, setShowWatchMovies] = useState(false);

  //Debounce the search term to prevent making too many API requests
  useDebounce(() =>setDebouncedSearchTerm(searchTerm), 500, [searchTerm]) 

  const fetchMovies = async (query ='') => {
    setIsLoading(true);
    setErrorMessage('');
    
   

    try{
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      
      if (!response.ok){
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json();
      setMovieList(data.results);//Modifiquei agora
      if(data.response == false){
        setErrorMessage(data.errorMessage || 'Faild to get movies');
        setMovieList([]);

        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      } 
    }catch (error){
      console.error(`Error fetching movies:${error}`);
      setErrorMessage ('Error fetching movies.Please try again.')
    }finally{
      setIsLoading(false);
    }
  }
  const handleWatchClick = (movie) =>{
    setSelectedMovie(movie);
    setShowWatchMovies(true)
  }
  const handleBack = () => {
    setShowWatchMovies(false);
    setSelectedMovie(null);
  };

  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    }catch(error){
      console.log(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(()=> {
    fetchMovies (debouncedsearchTerm);
  }, [debouncedsearchTerm]);

  useEffect(()=> {
    loadTrendingMovies();
  }, []);

  

//_________________R e n d e r i n g-------T h i n g s _________________________________________________________


return (
  <main>
    {showWatchMovies ? (
      <WatchMovies movie={selectedMovie} onBack={handleBack} />
    ) : (
      <>
        <div className='pattern'/>
        <div className='wrapper'>
          <header>
          <img
              src='./logo2.png'
              alt='Logo'
             className="absolute top-3 -left-7 w-15  sm:w-56 md:w-64 lg:w-48 h-auto max-w-none z-50"
            />
            <img src='/hero.png' alt='herro banner ' className='-mt-29 -mb-10' />
            <h1>
              Find <span className="text-gradient">movies</span> you'll enjoy without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}  />
          </header>

          {trendingMovies?.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onWatchClick={handleWatchClick} /> 
                ))}
              </ul>
            )}
          </section>
        </div>
      </>
    )}
  </main>
);
};

export default App
