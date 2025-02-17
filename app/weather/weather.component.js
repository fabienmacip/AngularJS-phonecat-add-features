"use strict";

angular.module("weather").component("weatherCard", {
  templateUrl: "weather/weather.template.html",
  controller: [
    "Weather",
    function WeatherController(Weather) {
      var self = this;
      self.weather = null;
      self.weatherError = null;

      Weather.getCurrentWeather()
        .then(function (data) {
          self.weather = data;
        })
        .catch(function (error) {
          self.weatherError = error;
        });
    },
  ],
});
