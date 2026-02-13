const locationInputEl = document.getElementById("locationInput");
const searchButtonEl = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");

function fetchWeather(city) {
    const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(urlGeocoding)
        .then(res => res.json())
        .then(geocodingData => {
            if (!geocodingData.results) {
                alert("City not found!");
                return;
            }

            const lat = geocodingData.results[0].latitude;
            const lon = geocodingData.results[0].longitude;
            const realName = geocodingData.results[0].name;

            const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            return fetch(urlWeather)
                .then(res => res.json())
                .then(weatherData => {
                    locationElement.textContent = realName;
                    temperatureElement.textContent = `${Math.round(weatherData.current_weather.temperature)}°C`;
                    descriptionElement.textContent = `Wind: ${weatherData.current_weather.windspeed} km/h`;
                });
        })
        .catch(error => console.error("API Error:", error));
}

searchButtonEl.addEventListener("click", () => {
    const city = locationInputEl.value;
    if (city) {
        fetchWeather(city);
    } else {
        alert ("Oops! Please enter a city name.")
    }
})