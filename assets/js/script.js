//----------------------------------------------GLOBAL VARIABLES
let openWeatherKey="eb3997fae2c925d2df0bffe2f227aa9d";
let savedCities = [];
let cityListEl = document.getElementById('city-list');
let currentCity="Madison,WI,US";
let cityInputEl = document.getElementById('city');
let citySearchFormEl = document.getElementById('city-search-form');
let currentWeatherEl = document.getElementById('current-weather');


//----------------------------------------------FUNCTIONS
function fetchWeatherFor(city) {
    var latitude;
    var longitude;
    var geoCodeLimits=5;
    var openWeatherGeoCodeURL = "https://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid="+openWeatherKey+"&limit="+geoCodeLimits;
    //see https://openweathermap.org/api/geocoding-api#direct_how for reference on how to configure this URL.

    fetch(openWeatherGeoCodeURL).then(function(response) {
        if(response.ok) {
            response.json().then(function(coordinatesJSON){
                latitude=coordinatesJSON[0].lat;
                longitude=coordinatesJSON[0].lon;
                //feed the coordinates back to openweathermap to get all the date we need
                fetchWeatherForCoordinates(latitude,longitude);
                saveCity(city,latitude,longitude);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to OpenWeather!");
    });
}

function fetchWeatherForCoordinates(latitude,longitude) {
    var weatherUnits="imperial";
    var weatherDataToExclude="minutely,hourly,alerts";
    var openWeatherUrl ="https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&exclude="+weatherDataToExclude+"&appid="+openWeatherKey+"&units="+weatherUnits;
    //see https://openweathermap.org/api/one-call-api for reference on how to configure this URL.
    
    fetch(openWeatherUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(weatherJSON) {
                //take the weather data we got back and build HTML
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
    currentWeatherEl.innerHTML = "";
    currentWeatherEl.setAttribute("class","card");
    document.getElementById("currently-title").setAttribute("class","");

    //Header = city (date) icon
    var headerEl = document.createElement("h3");
    headerEl.innerHTML = currentCity + " (" + getReadableDate(fromWeatherJSON.current.dt) + ") ";
    currentWeatherEl.appendChild(headerEl);

    //image of weather
    var weatherVisualEl = document.createElement("p");
    weatherVisualEl.innerHTML="<img src='http://openweathermap.org/img/wn/"+fromWeatherJSON.current.weather[0].icon+"@2x.png'>";
    currentWeatherEl.appendChild(weatherVisualEl);

    //Temperature
    var temperatureEl = document.createElement("p");
    temperatureEl.innerHTML = "Temperature: " + fromWeatherJSON.current.temp.toFixed() + String.fromCharCode(176) + "F";
    currentWeatherEl.appendChild(temperatureEl);

    //Humidity
    var humidityEl = document.createElement("p");
    humidityEl.innerHTML = "Humidity: " + fromWeatherJSON.current.humidity + "%";
    currentWeatherEl.appendChild(humidityEl);

    //Wind Speed
    var windSpeedEl = document.createElement("p");
    windSpeedEl.innerHTML = "Wind Speed: " + fromWeatherJSON.current.wind_speed + " MPH";
    currentWeatherEl.appendChild(windSpeedEl);

    //UV Index with Green/Yellow/Red background based on value
    var uvIndexValue = fromWeatherJSON.current.uvi;
    var uvIndexEl = document.createElement("p");
    if (uvIndexValue < 3) {
        uvIndexEl.innerHTML = "UV Index: <span class='low-risk'>" + uvIndexValue.toFixed(2) + "</span>";
    } 
    else if (uvIndexValue < 5) {
        uvIndexEl.innerHTML = "UV Index: <span class='moderate-risk'>" + uvIndexValue.toFixed(2) + "</span>";
    }
    else {
        uvIndexEl.innerHTML = "UV Index: <span class='high-risk'>" + uvIndexValue.toFixed(2) + "</span>";
    }
    currentWeatherEl.appendChild(uvIndexEl);
}

function buildFiveDayForecastHTML(fromWeatherJSON) {
    let dailyWeatherArray = fromWeatherJSON.daily;
    let dailyWeatherArrayLength = dailyWeatherArray.length;
    //only care about at most next 5 days of weather
    if (dailyWeatherArrayLength > 5) {
        dailyWeatherArrayLength = 5; 
    };
    
    document.getElementById("five-day-title").setAttribute("class","");

    //loop over weatherJSON.daily 0
    for (let i = 0; i < dailyWeatherArrayLength; i++) {
        const weatherForDay = dailyWeatherArray[i];
               
        let elementID = "day-" + i.toString();
        let dayCardEl = document.createElement("div");
        dayCardEl.setAttribute("class","card");
        let dateEl = document.createElement("h4");
        let iconEl = document.createElement("p");
        let tempHighEl = document.createElement("p");
        let tempLowEl = document.createElement("p");
        let humidityEl = document.createElement("p");        

        let date = getReadableDate(weatherForDay.dt);
        dateEl.innerHTML = date;
        dayCardEl.appendChild(dateEl);

        iconEl.innerHTML = "<img src='http://openweathermap.org/img/wn/"+weatherForDay.weather[0].icon+"@2x.png'>";
        dayCardEl.appendChild(iconEl);

        tempHighEl.innerHTML = "High: " + weatherForDay.temp.max.toFixed() + String.fromCharCode(176) + "F";
        dayCardEl.appendChild(tempHighEl);

        tempLowEl.innerHTML = "Low: " + weatherForDay.temp.min.toFixed() + String.fromCharCode(176) + "F";
        dayCardEl.appendChild(tempLowEl);

        humidityEl.innerHTML = "Humidity: " + weatherForDay.humidity +"%";
        dayCardEl.appendChild(humidityEl);

        document.getElementById(elementID).innerHTML="";
        document.getElementById(elementID).appendChild(dayCardEl);
    }
}

function getReadableDate(openWeatherUnixDate) {
    let date = new Date(openWeatherUnixDate*1000);
    return (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
}

function citySearchHandler(event) {
    event.preventDefault();

    //get the submited city value
    currentCity = cityInputEl.value.trim();
    console.log(currentCity);
    if (currentCity) {
        fetchWeatherFor(currentCity);
        cityInputEl.value = "";
    } else {
        alert("Please enter a valide city or city,state");
    }
}

function savedCitiesHandler(event) {
    event.preventDefault();
    console.log(this); //where the listener was setup
    console.log(event.target); //what element actually started it all
    //get the saved city string
    currentCity = event.target.textContent;
    fetchWeatherFor(currentCity);
}

function saveCity(city,latitude,longitude) {
    savedCities.push({
        city: city,
        latitude: latitude,
        longitude: longitude
    });
    //store the last 7 searches
    if (savedCities.length > 7) {
        savedCities.shift();
    }
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    loadCities();
}

function loadCities() {
    savedCities = JSON.parse(localStorage.getItem("savedCities"));
    if (!savedCities) {
        savedCities = [];
    }

    cityListEl.innerHTML = "";
    for (let i = savedCities.length-1; i >= 0; i--) {
        const element = savedCities[i];
        let prevCityButtonEl = document.createElement("button");
        prevCityButtonEl.setAttribute("type","button");
        prevCityButtonEl.setAttribute("class","col-md-2 btn saveBtn");
        prevCityButtonEl.textContent = element.city.replace(",",", ");
        cityListEl.appendChild(prevCityButtonEl);
    }
}


//----------------------------------------------CALLS
// fetchWeatherFor(currentCity);
loadCities();
citySearchFormEl.addEventListener("submit",citySearchHandler);
cityListEl.addEventListener("click",savedCitiesHandler);



