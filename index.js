const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

//used to load the environment variable stored in .env loacl file
dotenv.config();

const app = express();

const port = process.env.PORT || "8888";

app.set("views",path.join(__dirname,"views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended: true}));

app.use(express.json());

// routes
const { getYoutubeVideos } = require("./components/youtube/api");
const { getWeather } = require("./components/weather/api");
const { getPlaces, getAttractions } = require("./components/location/api");


app.get("/attractions", async (request, response) => {
    const query = request.query.q || "Toronto attractions";
    const places = await getAttractions(query);
    response.json(places);
});
app.get("/places", async (request, response) => {
    const query = request.query.q || "Toronto attractions";
    const places = await getPlaces(query);
    response.json(places);
});

app.get("/weather", async (request, response) => {
    const destination = request.query.destination;

    const placesData = await getPlaces(destination);
    
    const { lat, lng } = placesData[0].geometry.location;
    const weatherData = await getWeather(lat, lng);

    if (weatherData.error) {
        // If there's an error, display it
        response.render("result", {
            error: weatherData.error,
            destination
        });
    } else {
        // If there's no error, render the weather data
        response.render("result", {
            weather: weatherData,
            destination
        });
    }
});



app.get("/youtube", async (request, response) => {
    const query = request.query.q || "travel vlog";
    const videos = await getYoutubeVideos(query);
    response.json(videos);
});

// Serve the homepage
app.get("/", (request, response) => {
    response.render("index");
});

// Handle form submission


app.get("/submit", async (request, response) => {
    const destination = request.query.destination;

    // Get the location data
    const placesData = await getPlaces(destination);
    
    // If no places data found, return an error message
    if (!placesData || placesData.length === 0) {
        return response.render("result", {
            error: "No location found for the given destination.",
            destination
        });
    }

    const { lat, lng } = placesData[0].geometry.location;

    // Fetch data from APIs
    const weatherData = await getWeather(lat, lng);
    const attractionData = await getAttractions(destination + " Attractions");
    const youtubeData = await getYoutubeVideos(destination + " travel vlog");

    // Check if the weather data contains an error
    if (weatherData.error) {
        return response.render("result", {
            error: weatherData.error,
            youtube: youtubeData,
            attractions: attractionData,
            destination
        });
    }

    // Render the result page with the weather data, attractions, and youtube videos
    response.render("result", {
        youtube: youtubeData,
        weather: weatherData,
        attractions: attractionData,
        destination
    });
});




app.listen(port, () =>{
    console.log(`Listening on http://localhost:${port}`);
});