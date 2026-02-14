const locationInputEl = document.getElementById("locationInput");
const searchButtonEl = document.getElementById("searchButton");
const cityEl = document.querySelector(".city");
const cityNameEl = document.querySelector(".city-name");
const temperatureEl = document.querySelector(".temperature");
const windEl = document.querySelector(".wind");
const iconEl = document.querySelector(".icon");
const loadingEl = document.querySelector(".loading");
const errorEl = document.querySelector(".error");

function getWeatherEmoji(weatherCode) {
    switch (weatherCode) {
        case 0: return "☀️";
        case 1: case 2: case 3: return "☁️";
        case 61: case 63: case 65: return "🌧️";
        case 71: case 73: case 75: return "❄️";
        case 95: case 96: case 99: return "⛈️";
        default: return "🌤️";
    }
}

function applyWeatherClasses(weatherCode) {
    const body = document.body;
    const container = document.querySelector(".weather-container");
    body.classList.remove("clear-sky", "cloudy", "rain", "snow");
    container.classList.remove("clear-sky", "cloudy", "rain", "snow");
    switch (weatherCode) {
        case 0:
            body.classList.add("clear-sky");
            container.classList.add("clear-sky");
            break;
        case 1: case 2: case 3:
            body.classList.add("cloudy");
            container.classList.add("cloudy");
            break;
        case 61: case 63: case 65:
            body.classList.add("rain");
            container.classList.add("rain");
            break;
        case 71: case 73: case 75:
            body.classList.add("snow");
            container.classList.add("snow");
            break;
        case 95: case 96: case 99:
            body.classList.add("rain");
            container.classList.add("rain");
            break;
        default:
            body.classList.add("clear-sky");
            container.classList.add("clear-sky");
            break;
    }
}

function fetchWeather(city) {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";

    const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(urlGeocoding)
        .then(res => res.json())
        .then(geocodingData => {
            if (!geocodingData.results) throw new Error("City not found");
            const { latitude: lat, longitude: lon, name: realName } = geocodingData.results[0];
            const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            return fetch(urlWeather)
                .then(res => res.json())
                .then(weatherData => {
                    const temp = Math.round(weatherData.current_weather.temperature);
                    const wind = weatherData.current_weather.windspeed;
                    const weatherCode = weatherData.current_weather.weathercode;

                    cityNameEl.textContent = realName;
                    temperatureEl.textContent = `${temp}°C`;
                    windEl.textContent = `Wind: ${wind} km/h`;
                    iconEl.textContent = getWeatherEmoji(weatherCode);

                    applyWeatherClasses(weatherCode);

                    loadingEl.style.display = "none";
                });
        })
        .catch(error => {
            loadingEl.style.display = "none";
            errorEl.style.display = "block";
            errorEl.textContent = "Please enter a valid city!";
        });
}

searchButtonEl.addEventListener("click", () => {
    const city = locationInputEl.value.trim();
    if (city) fetchWeather(city);
    else {
        errorEl.style.display = "block";
        errorEl.textContent = "Please enter a valid city!";
    }
});

locationInputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchButtonEl.click();
});
