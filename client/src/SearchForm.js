import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function SearchForm({ onRatingData }){
    const [suggestions, setSuggestions] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    
    async function handleSubmit(e){
        const movieTitle = e.target.title.value;
    
        e.preventDefault();
    
        try{
          const response = await fetch(`/ratings?title=${movieTitle}`);
          const data = await response.json();
          onRatingData(data);
    
        }catch(err){
          console.error(err);
          onRatingData("N");
        }
      }
      let timeoutId;
      async function onChangeHandler(e) {
        setSearchTitle(e);
        if (e.length > 2) {
          timeoutId = setTimeout(async () => {
            try {
              const response = await fetch(`/searchTitle?title=${e}`);
              const data = await response.json();
      
              if (data === "N") {
                throw new Error("Filme não encontrado");
              } else {
                setSuggestions(data);
              }
            } catch (err) {
              setSuggestions("");
              console.log(err);
            }
          }, 500);
        } else {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          setSuggestions([]);
        }
      }

      function onSuggestHandler(title){
        setSearchTitle(title);
        setSuggestions("");
      }

    return(
      <div className="input-form">
        <form onSubmit={(e)=> handleSubmit(e)}>
          <div>
            <h1 className="main-text">Type a Movie Title</h1>
          </div>
          <div className="input-container">
            <button type="submit" className="submit-button">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" type="submit" />
            </button>
            <input 
              name="title"
              type="text"
              required
              onChange={(e)=> onChangeHandler(e.target.value)}
              value={searchTitle}
              className="input-text">
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
    )
}

export default SearchForm;