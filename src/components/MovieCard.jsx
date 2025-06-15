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
     <div className='flex flex-wrap gap-2 items-center justify-between w-full sm:w-auto  '>
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
        className="my-button "
        onClick={() => onWatchClick(movie)} 
      >
        Watch Trailer
      </button>
    </div>
     </div>
  )
}

export default MovieCard