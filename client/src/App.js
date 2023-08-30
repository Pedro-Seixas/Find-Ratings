import React, {useEffect, useState} from 'react'
import "./App.css";

function App(){

  const [backendData, setBackendData] = useState("");
  const [title, setTitle] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    const movieTitle = e.target.title.value;

    fetch(`/ratings?title=${movieTitle}`).then(
      response => response.json()
      ).then(
        data => {
          console.log(data.ratings);
        }
      )
    //Check if it has space in it and treat it
    //Call function from routes to send to backend
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
            type="submit">submit</button>
      </div>
      </form>
      </div>
      <div class="wrapper">
  <div class="rating-group">
    <img src="/img/metaCritic.png" class="source"/>
    <h1 class="rating">
      96%
    </h1>
  </div>
  
  <div class="rating-group">
    <img src="/img/RT.png" class="source"/>
    <h1 class="rating">
      66%
    </h1>
  </div>
  
  <div class="rating-group">
    <img src="/img/imdb.png" class="source"/>
    <h1 class="rating">
      92%
    </h1>
  </div>
  <div class="rating-group">
    <img src="/img/justWatch.png" class="source"/>
    <h1 class="rating">
      92%
    </h1>
  </div>
</div>
    </div>

  )
}

export default App