import React, {useEffect, useState} from 'react'
import "./App.css";

function App(){
  const [title, setTitle] = useState([]);
  const [movieRating, setMovieRating] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  async function handleSubmit(e){
    const movieTitle = e.target.title.value;

    e.preventDefault();
    setTitle(movieTitle);

    try{
      const response = await fetch(`/ratings?title=${movieTitle}`);
      const data = await response.json();
      setMovieRating(data);
      setFormSubmitted(true);

    }catch(err){
      console.error(err);
      setMovieRating("n");
      setFormSubmitted(true);

    }
  }

  return(
    <div>
      <div>
        <h1 class="main-text">Type a Movie Title</h1>
      </div>
      <div class="input-form">
      <form onSubmit={(e)=> handleSubmit(e)}>
        <input 
          name="title"
          type="text"
          required
          value={title}
          onChange={(e)=> setTitle(e.target.value)}></input>
        <div class="button-container">
          <button 
            class="search-button"
            type="submit">Submit</button>
      </div>
      </form>
      </div>
    {formSubmitted &&(
  <div class="wrapper"> 
      <div class="rating-group">
        <img src="/img/imdb2.png" class="source"/>
        <h1 class="rating">
          {movieRating.imdb}
        </h1>
      </div>
      <div class="rating-group">
        <img src="/img/metaCritic.png" class="source"/>
        <h1 class="rating">
          {movieRating.metaCritic}
        </h1>
      </div>
      <div class="rating-group">
      <img src="/img/justWatch.png" class="source"/>
      <h1 class="rating">
        {movieRating.justWatch}
      </h1>
    </div>
  </div>
    )}
  </div>

  )
}

export default App