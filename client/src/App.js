import React, {useEffect, useState} from 'react'
import "./App.css";

function App(){

  const [backendData, setBackendData] = useState("");

  useEffect(() => {
    fetch("/ratings").then(
      response => response.json()
      ).then(
        data => {
          setBackendData(data.ratings);
        }
      )
  }, []);
  return(
    <div>
      <div>
        <h1 class="main-text">Type a Movie Title</h1>
      </div>
      <div class="input-form">
      <form>
        <input type="text"></input>
      </form>
      </div>
      <div class="button-container">
        <button class="search-button">submit</button>
      </div>
    </div>

  )
}

export default App