const express = require('express');
const app = express();
const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

app.get("/ratings", async (req, res) =>{
    try{
        const rating = await ratingJson(req.query.title);
        console.log(rating);
        res.json(rating);
    }catch(err){
        console.error(err);
    }
});

async function ratingJson(name){
    let nameLower = name.toLowerCase();
    let imdbName = nameLower;
    let metaCriticName = nameLower;
    let justWatchName = nameLower;
    let rtName = nameLower;
    try {
        const ratingJson = {
            imdb: "N",
            metaCritic: "N",
            rt: "N",
            justWatch: "N"
        };
    
        if(name.indexOf(" ")>0)
        {
            imdbName = nameLower.replace(" ","%20");
            metaCriticName = nameLower.replace(" ","-");
            justWatchName = metaCriticName;
            rtName = nameLower.replace(" ","_");
        }

        //ratingJson.rt = await getRTRating(rtName);
        ratingJson.imdb = await getImdbRating(imdbName);
        ratingJson.metaCritic = await getMetaCriticRating(metaCriticName);
        ratingJson.justWatch = await getJustWatchRating(justWatchName);

        return ratingJson;

} catch(err){
    console.log(err);
}
}


// async function getRTRating(name){
//     const url = `https://www.rottentomatoes.com/m/${name}`;
//     const urlResponse = await axios.get(url);
//     const $ = cheerio.load(urlResponse.data);
//     const rating = $("div.thumbnail-scoreboard-wrap > score-board").attr("audiencescore");
//     return rating;
// }


async function getImdbRating(name){
    const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`;

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: []
    }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        if (json.results && json.results.length > 0) {
            if (json.results[0].vote_average === null || json.results[0].vote_average === undefined) {
                return "N";
            } else {
                return json.results[0].vote_average;
            }
        } else {
            return "N"; 
        }

    } catch (err) {
        console.error('error:' + err);
        return "N";
    }
}

async function getMetaCriticRating(name){
    const url = `https://www.metacritic.com/movie/${name}`;

    try {
        const urlResponse = await axios.get(url);

        const $ = cheerio.load(urlResponse.data);
        const rating = $("span.metascore_w.user").html();

        if (rating === null || rating === undefined) {
            return "N";
        } else {
            return rating;
        }
    } catch (error) {
        console.error('Error: ' + error.message);
        return "N";
    }
}

async function getJustWatchRating(name){
    const url = `https://www.justwatch.com/us/movie/${name}`;
    try{
        const urlResponse = await axios.get(url);

        const $ = cheerio.load(urlResponse.data);
        const rating = [];

        $("span.jw-scoring-listing__rating--no-link").each(function(i, element){
        if(i === 0)
        {
            rating.push($(this).text().trim());
        }
        });

        if (rating[0] === null || rating[0] === undefined){
            return "N";
        }else{
            return rating[0];
        }
    }catch(err){
        return "N";
    }
}

//-------------------------------
//         IMDB API
//-------------------------------

//To find movie by name and give details like rating and popularity
// const url = 'https://api.themoviedb.org/3/search/movie?query=In%20Bruges&include_adult=false&language=en-US&page=1';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: [Your API KEY]
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json.results[0]))
//   .catch(err => console.error('error:' + err));

//-------------------------------
//     Rotten Tomatoes API
//-------------------------------

// url = "https://www.rottentomatoes.com/m/barbie";

// axios.get(url).then(urlResponse =>{
//     const $ = cheerio.load(urlResponse.data);
//     const rating = $("div.thumbnail-scoreboard-wrap>score-board").attr("audiencescore");
//     console.log(rating);

// });

//------------------------------
//        MetaCritic API
//------------------------------

// url = "https://www.metacritic.com/movie/nobody";

// axios.get(url).then(urlResponse =>{
//     const $ = cheerio.load(urlResponse.data);
//     const rating = $("span.metascore_w.user").html();
//     console.log(rating);

// });


//------------------------------
//        JustWatch API
//------------------------------

// url = "https://www.justwatch.com/us/movie/oppenheimer";

// axios.get(url).then(urlResponse =>{
//     const $ = cheerio.load(urlResponse.data)
//     //Find the first rating
//     $("span.jw-scoring-listing__rating--no-link").each(function(i, element){
//         if(i == 0)
//         {
//             console.log($(this).text());
//         }
//     });
// });


app.listen(5000);
