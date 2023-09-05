import React, {useState} from 'react'
import SearchForm from './SearchForm';
import Ratings from './Ratings';
import "./App.css";

function App(){
  const [movieRating, setMovieRating] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleRatingData = (data) => {
    setMovieRating(data);
    setFormSubmitted(true);
  };

  return(
    <div>
      <SearchForm onRatingData={handleRatingData} />
      {formSubmitted && <Ratings movieRating={movieRating} />}
    </div>

  )
}

export default App