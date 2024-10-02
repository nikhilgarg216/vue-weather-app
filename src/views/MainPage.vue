<template>
    <div class="d-flex justify-content-center mt-3 container ">
        <div class="bg-dark text-white w-100 p-4 rounded-4">
            <div class="d-flex justify-content-center align-items-center">
                <i class="bi bi-sun-fill fs-5"></i>
                <h4 class="ms-2">Weather App</h4>
            </div>
            <div class="input-group mb-3">
                <input v-model="city" @keyup.enter="getWeatherByCity" type="text" class="form-control"
                    placeholder="Enter city name" aria-label="City" aria-describedby="search-button" />
                <button @click="getWeatherByCity" class="btn btn-primary" type="button" id="search-button">
                    <i class="bi bi-search"></i>
                    Search
                </button>
            </div>
        </div>
    </div>
    <div class="weather-app">
        <div v-if="weather">
            <img :src="weatherImage" alt="Weather Image" class="weather-image">
            <h1>Weather in {{ weather.name }}</h1>
            <p><strong>City:</strong> {{ weather.name }} </p>
            <p><strong>Temperature:</strong> {{ weather.main.temp }} °C</p>
            <p><strong>Weather:</strong> {{ weather.weather[0].description }}</p>
            <p><strong>Humidity:</strong> {{ weather.main.humidity }}%</p>
            <p><strong>Wind Speed:</strong> {{ weather.wind.speed }} m/s</p>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            city: '',
            weather: null,
            weatherImage: '',
            apiKey: 'a7836ee53a020b00711ee5ead10d1b9f', // Replace with your OpenWeatherMap API Key
        };
    },
    methods: {
        getWeatherByCity() {
            if (this.city) {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`;
                axios
                    .get(url)
                    .then((response) => {
                        this.weather = response.data;
                        this.setWeatherImage();
                    })
                    .catch((error) => {
                        console.error("Error fetching weather data:", error);
                    });
            }
        },
        getWeatherByLocation(lat, lon) {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            axios
                .get(url)
                .then((response) => {
                    this.weather = response.data;
                    this.setWeatherImage();
                })
                .catch((error) => {
                    console.error("Error fetching weather data:", error);
                });
        },
        getCurrentLocationWeather() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.getWeatherByLocation(latitude, longitude);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        },
        setWeatherImage() {
    if (!this.weather || !this.weather.weather) return;

    const weatherMain = this.weather.weather[0].main.toLowerCase();

    switch (weatherMain) {
        case 'clear':
            this.weatherImage = '/img/images/clear.png';
            break;
        case 'mist':
            this.weatherImage = '/img/images/mist.png';
            break;
        case 'clouds':
            this.weatherImage = '/img/images/clouds.png';
            break;
        case 'rain':
            this.weatherImage = '/img/images/rain.png';
            break;
        case 'snow':
            this.weatherImage = '/img/images/snow.png';
            break;
        case 'thunderstorm':
            this.weatherImage = '/img/images/clouds.png'; // You might want a different image for thunderstorm.
            break;
        case 'drizzle':
            this.weatherImage = '/img/images/drizzle.png';
            break;
        case 'wind':
            this.weatherImage = '/img/images/wind.png';
            break;
        default:
            this.weatherImage = '/img/images/default.png'; // A default image if none of the cases match.
            break;
    }
}

    },
    mounted() {
        this.getCurrentLocationWeather();
    },
};

</script>
<style scoped>
.weather-app {
    text-align: center;
    margin-top: 50px;
}


button {
    padding: 10px 15px;
    cursor: pointer;
}

p {
    margin: 5px 0;
}

.input-group {
    max-width: 500px;
    margin: 0 auto;
}
</style>