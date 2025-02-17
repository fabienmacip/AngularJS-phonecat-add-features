"use strict";

// Register `phoneList` component, along with its associated controller and template
angular.module("phoneList").component("phoneList", {
  templateUrl: "phone-list/phone-list.template.html",
  controller: [
    "Phone",
    "PhoneState",
    function PhoneListController(Phone, PhoneState) {
      var self = this;
      self.phones = Phone.query();

      //this.orderProp = "age";
      var savedState = PhoneState.getState();
      self.query = savedState.query;
      self.orderProp = savedState.orderProp;

      self.reset = function () {
        //PhoneState.resetState();
        self.query = "";
        self.orderProp = "name";
      };

      self.$onDestroy = function () {
        PhoneState.saveState(self.query, self.orderProp);
      };
    },
  ],
});
