<template>
    <div class="d-flex justify-content-center my-3 container">
        <div class="bg-dark text-white w-100 p-4 rounded-4">
            <div class="d-flex justify-content-center align-items-center">
                <i class="bi bi-sun-fill fs-5"></i>
                <h4 class="ms-2">Weather App</h4>
            </div>
            <div class="input-group mb-3 position-relative">
                <input v-model="city" @input="fetchCitySuggestions" @keyup.enter="getWeatherByCity" type="text"
                    class="form-control" placeholder="Enter city name" aria-label="City"
                    aria-describedby="search-button" />
                <button @click="getWeatherByCity" class="btn btn-primary" type="button" id="search-button">
                    <i class="bi bi-search"></i>
                    Search
                </button>
            </div>
            <ul v-if="filteredCities.length" class="list-group">
                <li v-for="(suggestion, index) in filteredCities" :key="index"
                    class="list-group-item list-group-item-action" @click="selectCity(suggestion.name)">
                    {{ suggestion.name }}, {{ suggestion.country }}
                </li>
            </ul>
            <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
        </div>
    </div>
    <div class="p-2 container">
        <div class="row g-2">
    <!-- Weather App Section -->
    <div class="weather-app col-md-6 border bg rounded-3 text-white">
        <div v-if="weather">
            <img :src="weatherImage" alt="Weather Image" class="weather-image">
            <h1>Weather in {{ weather.name }}</h1>
            <p><strong>City:</strong> {{ weather.name }}</p>
            <p><strong>Temperature:</strong> {{ weather.main.temp }} °C</p>
            <p><strong>Weather:</strong> {{ weather.weather[0].description }}</p>
            <p><strong>Humidity:</strong> {{ weather.main.humidity }}%</p>
            <p><strong>Wind Speed:</strong> {{ weather.wind.speed }} m/s</p>
        </div>
    </div>

    <!-- Weather in Indian Cities Section -->
    <div class="col-md-6 weather-india border bg-light rounded-3 p-3 text-dark">
        <h4>Weather in Indian Cities</h4>
        <div class="row">
            <div class="col-md-6 mb-3" v-for="(city, index) in indianCities" :key="index">
                <div class="city-card border px-2 py-1 rounded">
                    <div class="d-flex justify-content-between align-items-center">
                        <div><strong>{{ city.name }}</strong></div>
                        <div v-if="city.weather">{{ city.weather.main.temp }} °C</div>
                        <div v-else>Loading...</div>
                    </div>
                    <p v-if="city.errorMessage" class="text-danger">{{ city.errorMessage }}</p>
                </div>
            </div>
        </div>
    </div>
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
            indianCities: [], // List of Indian cities with their weather data
            apiKey: 'a7836ee53a020b00711ee5ead10d1b9f',
            filteredCities: [],
            errorMessage: '',
        };
    },
    methods: {
        fetchCitySuggestions() {
            if (this.city.length < 3) { // Only fetch suggestions for 3 or more characters
                this.filteredCities = [];
                this.errorMessage = ''; // Clear error message when typing
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/find?q=${this.city}&appid=${this.apiKey}&units=metric`;

            axios
                .get(url)
                .then((response) => {
                    this.filteredCities = response.data.list; // Update with API response
                })
                .catch((error) => {
                    console.error("Error fetching city suggestions:", error);
                });
        },
        selectCity(cityName) {
            this.city = cityName;
            this.filteredCities = []; // Clear suggestions after selecting
            this.getWeatherByCity(); // Fetch weather for the selected city
        },
        getWeatherByCity() {
            this.errorMessage = ''; // Reset error message before fetching new data
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
                        this.errorMessage = 'City not found. Please try again.'; // Set error message on failure
                    });
            }
        },
        getWeatherForIndianCities() {
            const cities = [
                'Mumbai',
                'Delhi',
                'Bangalore',
                'Kolkata',
                'Chennai',
                'Hyderabad',
                'Ahmedabad',
                'Pune',
                'Jaipur',
                'Surat',
                'Lucknow',
                'Kanpur',
                'Nagpur',
                'Visakhapatnam',
                'Indore',
                'Thane',
                'Bhopal',
                'Coimbatore',
                'Vijayawada',
                'Mysore',
                'Patna',
            ];

            this.indianCities = cities.map((city) => ({ name: city, weather: null, errorMessage: '' }));

            this.indianCities.forEach((city) => {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},IN&appid=${this.apiKey}&units=metric`;
                axios
                    .get(url)
                    .then((response) => {
                        city.weather = response.data; // Store the weather data for the city
                        city.errorMessage = ''; // Clear any previous error messages
                    })
                    .catch((error) => {
                        console.error(`Error fetching weather data for ${city.name}:`, error);
                        city.errorMessage = 'Unable to fetch weather.'; // Set error message on failure
                    });
            });
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
                case 'haze':
                    this.weatherImage = '/img/images/wind.png';
                    break;
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
                    this.weatherImage = '/img/images/clouds.png';
                    break;
                case 'drizzle':
                    this.weatherImage = '/img/images/drizzle.png';
                    break;
                case 'wind':
                    this.weatherImage = '/img/images/wind.png';
                    break;
                default:
                    this.weatherImage = '/img/images/default.png';
                    break;
            }
        }
    },
    mounted() {
        this.getCurrentLocationWeather();
        this.getWeatherForIndianCities(); // Fetch weather for Indian cities on mount
    },
};
</script>

<style scoped>
.bg {
    background: linear-gradient(135deg, #00feba, #5b548a);
}

.input-group {
    max-width: 500px;
    margin: 0 auto;
    position: relative;
}

.list-group {
    position: absolute;
    top: 20%;
    left: 200;
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
    background-color: white;
    color: black;
}

.weather-app {
    text-align: center;
   
}

.weather-india {
    text-align: center;
}

.city-card {
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
}

.weather-image {
    max-width: 100%;
    height: auto;
}
</style>
