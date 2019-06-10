const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");
const placeApiKey = ""; //hidden :)
let weatherApiKey = ""; //unterminated string constant
const axios = require("axios");

// app.use(cors({ credentials: true, origin: "http://localhost:8000" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "static"))); //allows all files inside static folder to be linked using href
app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/getWeather", (req, res, next) => {
  let latitude, longitude, des, humidity, temp, wind;
  latitude = req.query.lat;
  longitude = req.query.long;
  let weatherUrl =
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    weatherApiKey;
  axios
    .get(weatherUrl)
    .then(data => {
      data = data.data;
      des = data.weather[0].main;
      temp = data.main.temp;
      wind = data.wind.speed;
      humidity = data.main.humidity;
      res.json({ desc: des, humidity: humidity, temp: temp, wind: wind });
    })
    .catch(err => {
      console.log("Could not fetch weather details");
      console.log(err);
    });
});

app.listen(3000, function init() {
  console.log("Weather App Running on Port 3000");
});
