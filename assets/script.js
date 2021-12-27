var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

var cities = [];

// Function that pulls information from the weather form

var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({ city });
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
};

// Function to save to local storage

var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Function that uses the OpenWeather API to obtian city's weather

var getCityWeather = function (city) {
    var apiKey = "844421298d794574c100e3409cee0499";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city);
        });
    });
};

// Function that displays information into the weather contianer

var displayWeather = function (weather, searchCity) {
    // Clears 
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    // Creates date element
    var currentDate = document.createElement("span");
    currentDate.textContent =
        " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    // Creates image element for icon
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    );
    citySearchInputEl.appendChild(weatherIcon);


    // Element for Temperature Data
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item";

    // Element for Humidity Data
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item";

    // Element for Wind Data
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item";

    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);
};

// Function for obtianing the UV Index through the API

var getUvIndex = function(lat,lon){
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)

        });
    });
};

// Displays the current UV index

var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);
    weatherContainerEl.appendChild(uvIndexEl);
};


// Function that calls for the Five-day Forecast

var get5Day = function (city) {
    var apiKey = "844421298d794574c100e3409cee0499";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            display5Day(data);
        });
    });
};


// FUnction that will display the information for the 5day forecast
var display5Day = function (weather) {
    forecastContainerEl.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-info text-light m-2";

        // Element for the Date
        var forecastDate = document.createElement("h5");
        forecastDate.textContent = moment
            .unix(dailyForecast.dt)
            .format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center";
        forecastEl.appendChild(forecastDate);

        // Element for the Image 
        var weatherIcon = document.createElement("img");
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
        );
        forecastEl.appendChild(weatherIcon);

        // Will display the Tempature
        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = "Temperature: " + dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);
        
        // Will display the Wind
        var forecastWindEl = document.createElement("span");
        forecastWindEl.classList = "card-body text-center";
        forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
        forecastEl.appendChild(forecastWindEl);
        
        // WIll display the Humidity
        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";

    
        forecastEl.appendChild(forecastHumEl);
        forecastContainerEl.appendChild(forecastEl);
    }
};


// Event Listeners for Form and Search

cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);
