<template>
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
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['indianCities'],
  };
  </script>
  