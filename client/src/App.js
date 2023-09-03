import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "./App.css";

function App(){
  const [suggestions, setSuggestions] = useState([]);
  const [movieRating, setMovieRating] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');

  async function handleSubmit(e){
    const movieTitle = e.target.title.value;

    e.preventDefault();

    try{
      const response = await fetch(`/ratings?title=${movieTitle}`);
      const data = await response.json();
      setMovieRating(data);
      setFormSubmitted(true);

    }catch(err){
      console.error(err);
      setMovieRating("N");
      setFormSubmitted(true);

    }
  }

  async function onChangeHandler(e){
    setSearchTitle(e);
    if(searchTitle.length>2){
      try{
        const response = await fetch(`/searchTitle?title=${e}`);
        const data = await response.json();

        if(data == "N"){
          throw new Error;
        }

        setSuggestions(data);
        console.log(data);
      }catch(err){
        setSuggestions("");
        console.log(err);
      }
    }else{
      setSuggestions([]);
    }
  }

  function onSuggestHandler(title){
    setSearchTitle(title);
    setSuggestions("");
  }
  
  return(
    <div>
      <div>
        <h1 class="main-text">Type a Movie Title</h1>
      </div>
      <div class="input-form">
      <form onSubmit={(e)=> handleSubmit(e)}>
        <div className="input-container">
          <button type="submit" class="submit-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" type="submit" />
          </button>
          <input 
            name="title"
            type="text"
            required
            onChange={(e)=> onChangeHandler(e.target.value)}
            value={searchTitle}
            class="input-text">
          </input>
        </div>
      </form>
      <div className={`suggestions-container ${suggestions.length === 0 ? 'hidden' : ''}`}>
      {suggestions && suggestions.map((suggestions, i)=>
        <div key={i} className='suggestions' onClick={() => onSuggestHandler(suggestions)}>
          <h1>{suggestions}</h1>
    </div>
  )}
  </div>
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