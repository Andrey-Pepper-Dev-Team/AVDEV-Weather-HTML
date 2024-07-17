const apiKey = '46966ef4def6372a9fef26d7e997dc01'; // Replace with your OpenWeather API key //Если заходите создать свой сайт погоды. То Вставте свой API ключ const apiKey = 'Свой API ключ OpenWeatherMap'; Получить можно тут: https://home.openweathermap.org/api_keys
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?';
const cityElement = document.getElementById('city');
const iconElement = document.getElementById('weather-icon');
const tempElement = document.getElementById('temperature');
const descElement = document.getElementById('description');
const feelsLikeTempElement = document.getElementById('feels-like-temp');
const humidityElement = document.getElementById('humidity-value');
const windSpeedElement = document.getElementById('wind-speed');
const uvIndexElement = document.getElementById('uv-index');
const pressureElement = document.getElementById('pressure-value');
const visibilityElement = document.getElementById('visibility-value');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const sunriseTimeElement = document.getElementById('sunrise-time');
const sunsetTimeElement = document.getElementById('sunset-time');
const forecastContainer = document.getElementById('forecast-container');
const unitToggle = document.getElementById('toggle-unit-button');
const unitElement = document.getElementById('unit');
const themeToggle = document.getElementById('theme-toggle');

let isCelsius = true;

searchButton.addEventListener('click', getWeather);
unitToggle.addEventListener('click', toggleUnits);
function getWeather() {
    const city = searchInput.value;
    fetch(`${apiUrl}appid=${apiKey}&q=${city}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                alert('Город не найден');
                return;
            }
            displayWeather(data);
            getForecast(city);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

}
function displayWeather(data) {
    cityElement.textContent = data.name;
    iconElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">`;
    tempElement.textContent = Math.round(data.main.temp); // Default to Celsius
    descElement.textContent = data.weather[0].description;
    feelsLikeTempElement.textContent = Math.round(data.main.feels_like); // Default to Celsius
    humidityElement.textContent = data.main.humidity;
    windSpeedElement.textContent = data.wind.speed;
    uvIndexElement.textContent = data.uvi;
    pressureElement.textContent = data.main.pressure;
    visibilityElement.textContent = (data.visibility / 1000).toFixed(1);
    // Get sunrise and sunset times
    const sunriseTimestamp = data.sys.sunrise;
    const sunsetTimestamp = data.sys.sunset;
    const sunrise = new Date(sunriseTimestamp * 1000);
    const sunset = new Date(sunsetTimestamp * 1000);
    // Format sunrise and sunset times
    sunriseTimeElement.textContent = sunrise.toLocaleTimeString();
    sunsetTimeElement.textContent = sunset.toLocaleTimeString();
    // Dynamic Day/Night Mode (based on sunrise/sunset)
    const now = new Date();
    if (now >= sunrise && now <= sunset) {
        document.body.classList.remove('night-mode');
    } else {
        document.body.classList.add('night-mode');
    }
}


function getForecast(city) {
    fetch(`${forecastUrl}appid=${apiKey}&q=${city}&units=metric`)
        .then(response => response.json())
        .then(data => {
            forecastContainer.innerHTML = '';
            const forecastDays = data.list.filter((item, index) => index % 8 === 0);
            forecastDays.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.classList.add('forecast-day');
                const dayOfWeek = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
                const icon = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">`;
                const temp = `
                        <p class="temp">${Math.round(day.main.temp_min)}°C / ${Math.round(day.main.temp_max)}°C</p>
                    `;
                const wind = `
                        <p>Wind: ${day.wind.speed} m/s</p>
                    `;
                const humidity = `
                        <p>Humidity: ${day.main.humidity}%</p>
                    `;
                const precipitation = `
                        <p>Precipitation: ${day.pop}%</p> 
                    `;
                dayElement.innerHTML = `
                        <p class="day">${dayOfWeek}</p>
                        <div class="icon">${icon}</div>
                        ${temp}
                        ${wind}
                        ${humidity}
                        ${precipitation}
                    `;
                forecastContainer.appendChild(dayElement);
            });
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('night-mode');
});


// Initial weather display (optional)
getWeather();
