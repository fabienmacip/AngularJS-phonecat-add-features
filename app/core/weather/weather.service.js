"use strict";

angular.module("core.weather", []).factory("Weather", [
  "$http",
  "$q",
  function ($http, $q) {
    function getWeatherIcon(code, isDay) {
      // WMO Weather interpretation codes (WW)
      // https://open-meteo.com/en/docs
      switch (code) {
        case 0: // Clear sky
          return isDay ? "sun" : "moon-stars";
        case 1: // Mainly clear
        case 2: // Partly cloudy
          return isDay ? "cloud-sun" : "cloud-moon";
        case 3: // Overcast
          return "clouds";
        case 45: // Foggy
        case 48: // Depositing rime fog
          return "cloud-fog";
        case 51: // Light drizzle
        case 53: // Moderate drizzle
        case 55: // Dense drizzle
        case 61: // Slight rain
        case 63: // Moderate rain
        case 65: // Heavy rain
          return "cloud-rain";
        case 71: // Slight snow fall
        case 73: // Moderate snow fall
        case 75: // Heavy snow fall
          return "snow";
        case 77: // Snow grains
          return "snow2";
        case 80: // Slight rain showers
        case 81: // Moderate rain showers
        case 82: // Violent rain showers
          return "cloud-rain-heavy";
        case 85: // Slight snow showers
        case 86: // Heavy snow showers
          return "cloud-snow";
        case 95: // Thunderstorm
          return "lightning";
        case 96: // Thunderstorm with slight hail
        case 99: // Thunderstorm with heavy hail
          return "cloud-lightning-rain";
        default:
          return "question-circle";
      }
    }

    return {
      getCurrentWeather: function () {
        // Return a promise that resolves with the weather data
        return $q(function (resolve, reject) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              // Success callback
              function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                $http
                  .get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m,precipitation,is_day`
                  )
                  .then(function (response) {
                    const data = response.data.current;
                    data.icon = getWeatherIcon(data.weathercode, data.is_day);
                    data.latitude = latitude;
                    data.longitude = longitude;
                    resolve(data);
                  })
                  .catch(function (error) {
                    reject("Error fetching weather data: " + error);
                  });
              },
              // Error callback
              function (error) {
                switch (error.code) {
                  case error.PERMISSION_DENIED:
                    reject("Geolocation permission denied");
                    break;
                  case error.POSITION_UNAVAILABLE:
                    reject("Location information unavailable");
                    break;
                  case error.TIMEOUT:
                    reject("Location request timed out");
                    break;
                  default:
                    reject("An unknown error occurred");
                }
              }
            );
          } else {
            reject("Geolocation is not supported by this browser");
          }
        });
      },
    };
  },
]);
