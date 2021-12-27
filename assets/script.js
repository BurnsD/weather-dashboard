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



// Event Listeners for Form and Search

cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);
