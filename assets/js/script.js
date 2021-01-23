//----------------------------------------------GLOBAL VARIABLES
var openWeatherKey="eb3997fae2c925d2df0bffe2f227aa9d";
var savedCities = [];
var currentCity = "Madison,WI,US";

var currentWeatherEl = document.getElementById('current-weather');

//----------------------------------------------FUNCTIONS
function fetchWeatherFor(city) {
    var latitude;
    var longitude;
    var geoCodeLimits=5;
    var openWeatherGeoCodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid="+openWeatherKey+"&limit="+geoCodeLimits;
    //PARAMS TO ADD{city name},{state code},{country code}&limit={limit}&appid={API key}
    console.log(openWeatherGeoCodeURL);

    fetch(openWeatherGeoCodeURL).then(function(response) {
        if(response.ok) {
            response.json().then(function(coordinatesJSON){
                latitude=coordinatesJSON[0].lat;
                longitude=coordinatesJSON[0].lon;
                console.log(latitude + "," +longitude);
                fetchWeatherForCoordinates(latitude,longitude);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connec to OpenWeather!");
    });
}

function fetchWeatherForCoordinates(latitude,longitude) {
    var weatherUnits="imperial";
    var weatherDataToExclude="minutely,hourly,alerts";
    var openWeatherUrl ="https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude="+weatherDataToExclude+"&appid="+openWeatherKey+"&units="+weatherUnits;
    //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
    // var openWeatherUrl="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+openWeatherKey+"&units="+weatherUnits;
    console.log(openWeatherUrl);
    
    fetch(openWeatherUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(weatherJSON) {
                console.log(weatherJSON);
                buildCurrentWeatherHTML(weatherJSON);
                buildFiveDayForecastHTML(weatherJSON);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather!");
    });
}

function buildCurrentWeatherHTML(fromWeatherJSON) {
    console.log(fromWeatherJSON);

    //Header = city (date) icon
    var headerEl = document.createElement("h3");
    headerEl.innerHTML = currentCity + "(" + fromWeatherJSON.current.dt + ")" + fromWeatherJSON.current.weather[0].icon;
    currentWeatherEl.appendChild(headerEl);

    //Temperature
    var temperatureEl = document.createElement("p");
    temperatureEl.innerHTML = "Temperature: " + fromWeatherJSON.current.temp;
    currentWeatherEl.appendChild(temperatureEl);

    //Humidity
    var humidityEl = document.createElement("p");
    humidityEl.innerHTML = "Humidity: " + fromWeatherJSON.current.humidity;
    currentWeatherEl.appendChild(humidityEl);

    //Wind Speed
    var windSpeedEl = document.createElement("p");
    windSpeedEl.innerHTML = "Wind Speed: " + fromWeatherJSON.current.wind_speed;
    currentWeatherEl.appendChild(windSpeedEl);

    //UV Index with Green/Yellow/Red background based on value
    var uvIndexEl = document.createElement("p");
    uvIndexEl.innerHTML = "UV Index: <span class='danger'>" + fromWeatherJSON.current.uvi + "</span>";
    currentWeatherEl.appendChild(uvIndexEl);
}

function buildFiveDayForecastHTML(fromWeatherJSON) {
    var dailyWeatherArray = fromWeatherJSON.daily;
    console.log(dailyWeatherArray);
    //loop over weatherJSON.daily 0
 
    //Date

    //icon of weather

    //Temperature

    //Humidity
}





//----------------------------------------------CALLS
fetchWeatherFor(currentCity);




