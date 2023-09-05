import React, {useState, useEffect} from 'react';

function Ratings({ movieRating }) {
    return(
        <div className="wrapper"> 
            <div className="rating-group">
                <img src="/img/imdb2.png" className="source"/>
                <h1 className="rating">
                {movieRating.imdb}
                </h1>
            </div>
            <div className="rating-group">
                <img src="/img/metaCritic.png" className="source"/>
                <h1 className="rating">
                {movieRating.metaCritic}
                </h1>
            </div>
            <div className="rating-group">
                <img src="/img/justWatch.png" className="source"/>
                <h1 className="rating">
                    {movieRating.justWatch}
                </h1>
            </div>
        </div>
    )
}

export default Ratings;