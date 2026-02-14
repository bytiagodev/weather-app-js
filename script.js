const locationInputEl = document.getElementById("locationInput");
const searchButtonEl = document.getElementById("searchButton");
const cityEl = document.querySelector(".city");
const temperatureEl = document.querySelector(".temperature");
const windEl = document.querySelector(".wind");
const iconEl = document.querySelector(".icon");
const containerEl = document.querySelector(".weather-container");
const loadingEl = document.querySelector(".loading");
const errorEl = document.querySelector(".error");

function getWeatherEmoji(weatherCode) {
    switch (weatherCode) {
        case 0: return "☀️";
        case 1: case 2: case 3: return "☁️";
        case 45: case 48: case 51: case 53: case 55: 
        case 56: case 57: case 61: case 63: case 65: 
        case 66: case 67: case 80: case 81: case 82: 
        case 95: case 96: case 99: return "🌧️";
        case 71: case 73: case 75: case 77: case 85: case 86: return "❄️";
        default: return "🌥️";
    }
}

function getWeatherType(weatherCode) {
    if (weatherCode === 0) return "clear-sky";
    if ([1,2,3].includes(weatherCode)) return "cloudy";
    if ([45,48,51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(weatherCode)) return "rain";
    if ([71,73,75,77,85,86].includes(weatherCode)) return "snow";
    return "cloudy";
}

function updateWeatherClasses(weatherCode) {
    const type = getWeatherType(weatherCode);
    document.body.className = type;
    containerEl.className = `weather-container ${type}`;
}

function fetchWeather(city) {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";

    const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(urlGeocoding)
        .then(res => res.json())
        .then(geoData => {
            if (!geoData.results || geoData.results.length === 0) throw new Error("City not found");

            const { latitude: lat, longitude: lon, name: realName } = geoData.results[0];
            const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            return fetch(urlWeather)
                .then(res => res.json())
                .then(weatherData => {
                    const temp = Math.round(weatherData.current_weather.temperature);
                    const wind = weatherData.current_weather.windspeed;
                    const weatherCode = Number(weatherData.current_weather.weathercode);

                    cityEl.textContent = realName;
                    temperatureEl.textContent = `${temp}°C`;
                    windEl.textContent = `Wind: ${wind} km/h`;
                    iconEl.textContent = getWeatherEmoji(weatherCode);

                    updateWeatherClasses(weatherCode);

                    loadingEl.style.display = "none";
                });
        })
        .catch(error => {
            loadingEl.style.display = "none";
            errorEl.style.display = "block";
            errorEl.textContent = "Please enter a valid city!";
            console.error("API Error:", error);
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
