'use strict';

(function () {

  window.data.generateProducts(function (productsArray) {
    window.productsOrderedArr = [];
    window.productsArray = productsArray;
    // для фильтров
    window.buffer = Object.assign({}, productsArray);

    window.data.renderCards(productsArray);
    window.filter.renderCounts(productsArray);
  });

  window.order.manageOrderForm();
  window.order.validateForm();
  window.order.submitForm();

})();
