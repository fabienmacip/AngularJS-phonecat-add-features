"use strict";

angular.module("core.weather", []).factory("Weather", [
  "$http",
  "$q",
  function ($http, $q) {
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

    function getWeatherIcon(code, isDay) {
      // ... existing getWeatherIcon function ...
    }
  },
]);
