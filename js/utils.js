'use strict';

(function () {

  window.utils = {};

  window.utils.getRandValue = function (min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  };

  window.utils.getRandElement = function (arr) {
    return Math.floor(Math.random() * arr.length);
  };

  window.utils.getRandElements = function (arr, count) {
    // count количество случайных элементов массива
    var result = [];
    for (var i = 0; i < count; i++) {
      result[i] = arr[window.utils.getRandElement(arr)];
    }
    return result.join(', ');
  };

  window.utils.plural = function (number, arrCase) {
    var cases = [2, 0, 1, 1, 1, 2];
    return arrCase[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  };

  window.utils.clearChildNodes = function (element) {
    if (element.hasChildNodes()) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  };

  // алгоритм Луна
  window.utils.luhnFilter = function (cardNumber) {
    if (isNaN(cardNumber)) {
      return false;
    }
    var arr = cardNumber.split('').map(function (char, index) {
      var digit = parseInt(char, 10);
      if ((index + cardNumber.length) % 2 === 0) {
        var digitX2 = digit * 2;
        return digitX2 > 9 ? digitX2 - 9 : digitX2;
      }
      return digit;
    });
    return !(arr.reduce(function (a, b) {
      return a + b;
    }, 0) % 10);
  };
})();
