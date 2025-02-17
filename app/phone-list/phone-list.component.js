"use strict";

// Register `phoneList` component, along with its associated controller and template
angular.module("phoneList").component("phoneList", {
  templateUrl: "phone-list/phone-list.template.html",
  controller: [
    "Phone",
    "PhoneState",
    "Weather",
    function PhoneListController(Phone, PhoneState, Weather) {
      var self = this;
      self.phones = Phone.query();
      self.orderProp = "age";
      self.weather = null;
      self.weatherError = null;

      var savedState = PhoneState.getState();
      self.query = savedState.query;
      self.orderProp = savedState.orderProp;

      self.reset = function () {
        //PhoneState.resetState();
        self.query = "";
        self.orderProp = "age";
      };

      self.$onDestroy = function () {
        PhoneState.saveState(self.query, self.orderProp);
      };

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
