import React from 'react'

const MovieCard = ({ movie, onWatchClick }) => {
  const { 
    title, 
    vote_average, 
    poster_path,
    original_language 
  } = movie;
  
  return (
    <div className="movie-card relative">
      <img
        src={poster_path ?
          `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
        alt={title}
      />
      <div className='mt-4 text-white'>
        {title}
      </div>
      <div className='content'>
        <div className='rating'>
            <img src='star.svg' alt='star-Icon'/>
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'} </p>
        </div>
        <span>•</span>
        <p className='lang'>{original_language}</p> 
      </div>
      <button
        className="border-2 border-b-cyan-600  absolute bottom-3 right-4 bg-black text-white px-2 py-2 rounded 
        shadow-xs hover:shadow-cyan-500 text-shadow-md transition-all duration-300"
        onClick={() => onWatchClick(movie)} 
      >
        Watch Trailer
      </button>
    </div>
  )
}

export default MovieCard