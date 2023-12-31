const express = require('express');
const app = express();
const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
require('dotenv').config();

app.get("/ratings", async (req, res) =>{
    try{
        const rating = await ratingJson(req.query.title);
        res.json(rating);
    }catch(err){
        console.error(err);
    }
});

app.get("/searchTitle", async (req, res) =>{
    try{
        const title = await searchMovieTitle(req.query.title);
        res.json(title);
    }catch(err){
        console.error(err);
    }
});

async function ratingJson(name){
    let nameLower = name.toLowerCase();
    let imdbName = nameLower;
    let metaCriticName = nameLower;
    let justWatchName = nameLower;
    //let rtName = nameLower;
    try {
        const ratingJson = {
            imdb: "N",
            metaCritic: "N",
            rt: "N",
            justWatch: "N"
        };
    
        if(name.indexOf(" ")>0)
        {
            imdbName = nameLower.replace(/\s/g,"%20");
            metaCriticName = nameLower.replace(/\s/g,"-").replace(":","").replace(".","");
            console.log(metaCriticName);
            justWatchName = metaCriticName;
            //rtName = nameLower.replace(" ","_");
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

async function getMovieID(name){
    const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`;

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: [process.env.IMDB_API]
    }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();

        if (json.results && json.results.length > 0) {
            if (json.results[0].vote_average === null || json.results[0].vote_average === undefined) {
                throw new Error;
            } else {
                return json.results[0].id;
            }
        }else {
            throw new Error;
        }

    } catch (err) {
        console.error('error:' + err);
        return "Not Found";
    }
}
async function getImdbID(name){
    const movie_id = await getMovieID(name);
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/external_ids`;

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: [process.env.IMDB_API]
    }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        if(json.imdb_id){
            return json.imdb_id;
        }else{
            throw err;
        }

    } catch (err) {
        console.error('error:' + err);
        return "Not Found";
    }

}
async function getImdbRating(name){
    const imdb_id = await getImdbID(name);

    const url = `https://www.imdb.com/title/${imdb_id}`;
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html',
            'Referer': 'https://www.google.com/'
          }
    }
    try {
        const urlResponse = await axios.get(url, options);

        const $ = cheerio.load(urlResponse.data);
        const rating = $("div.sc-bde20123-2>span").html();
        return rating
    } catch (error) {
        console.error('Error: ', error.message);
        return "Not Found";
    }
}

async function getMetaCriticRating(name){
    const url = `https://www.metacritic.com/movie/${name}`;

    try {
        const urlResponse = await axios.get(url);

        const $ = cheerio.load(urlResponse.data);
        const rating = $("div.c-siteReviewScore_background-user>div>span").html();
        if (rating === null || rating === undefined) {
            throw new Error;
        } else {
            return rating;
        }
    } catch (error) {
        console.error('Error: ', error.message);
        return "Not Found";
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
            throw new Error;
        }else{
            return parseInt(rating[0].replace("%",""))/10;
        }
    }catch(err){
        return "Not Found";
    }
}

async function searchMovieTitle(name){
const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`;

    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: [process.env.IMDB_API]
    }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        const titles = [];
        let count = 0;
        
        if (json.results && json.results.length > 0) {
            if (json.results[0].vote_average === null || json.results[0].vote_average === undefined) {
                throw new Error;
            } else {
                for(const results of json.results){
                    if(count < 7){
                        titles.push(results.original_title);
                        count++;
                    }else{
                        break;
                    }
                }
                return titles;
            }
        } else {
            throw new Error("No Results");
        }

    } catch (err) {
        console.error('error:' + err.message);
        return "N";
    }
}
app.listen(5000);

// const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=1`;

//     const options = {
//     method: 'GET',
//     headers: {
//         accept: 'application/json',
//         Authorization: [process.env.IMDB_API]
//     }
//     };

//     try {
//         const response = await fetch(url, options);
//         const json = await response.json();

//         if (json.results && json.results.length > 0) {
//             if (json.results[0].vote_average === null || json.results[0].vote_average === undefined) {
//                 throw new Error;
//             } else {
//                 return json.results[0].vote_average.toFixed(1);
//             }
//         }else {
//             throw new Error;
//         }

//     } catch (err) {
//         console.error('error:' + err);
//         return "Not Found";
//     }