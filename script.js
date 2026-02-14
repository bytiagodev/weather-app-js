const locationInputEl = document.getElementById("locationInput");
const searchButtonEl = document.getElementById("searchButton");
const cityEl = document.querySelector(".city"); // permanece fixo
const cityNameEl = document.querySelector(".city-name"); // novo elemento para o nome da cidade
const temperatureEl = document.querySelector(".temperature");
const windEl = document.querySelector(".wind");
const iconEl = document.querySelector(".icon");
const loadingEl = document.querySelector(".loading");
const errorEl = document.querySelector(".error");

function getWeatherEmoji(weatherCode) {
    switch (weatherCode) {
        case 0:
            return "☀️";
        case 1:
        case 2:
        case 3:
            return "☁️";
        case 61:
        case 63:
        case 65:
            return "🌧️";
        case 71:
        case 73:
        case 75:
            return "❄️";
        case 95:
        case 96:
        case 99:
            return "⛈️";
        default:
            return "🌤️";
    }
}

function fetchWeather(city) {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";

    const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(urlGeocoding)
        .then(res => res.json())
        .then(geocodingData => {
            if (!geocodingData.results) {
                throw new Error("City not found");
            }

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
    if (city) {
        fetchWeather(city);
    } else {
        errorEl.style.display = "block";
        errorEl.textContent = "Please enter a valid city!";
    }
});

locationInputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchButtonEl.click();
});
