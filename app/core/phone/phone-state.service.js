"use strict";

angular.module("core.phoneState", []).factory("PhoneState", function () {
  var state = {
    query: "",
    orderProp: "age",
  };

  return {
    saveState: function (query, orderProp) {
      state.query = query;
      state.orderProp = orderProp;
    },
    getState: function () {
      return state;
    },
  };
});
