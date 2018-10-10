'use strict';

(function () {

  window.data.generateProducts(function (productsArray) {
    window.productsOrderedArr = [];
    window.productsArray = productsArray;

    window.data.renderCards(productsArray);

    // эвенты
    var buttonsFavorite = window.dom.catalogCards.querySelectorAll('.card__btn-favorite');
    buttonsFavorite.forEach(function (button) {
      button.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.target.classList.toggle('card__btn-favorite--selected');
      });
    });

    var buttonsOrder = window.dom.catalogCards.querySelectorAll('.card__btn');
    buttonsOrder.forEach(function (button) {
      button.addEventListener('click', function (evt) {
        evt.preventDefault();
        // получаем дом объект нажатого товара и вытаскиваем id товара для поиска и манипуляций в js объектах
        var targetProductId = evt.path[3].dataset.productid;
        if (targetProductId) {
          if (window.catalog.checkPriceAndDecreaseAmount(targetProductId)) {
            // если есть в наличии
            if (!window.catalog.checkAndInsertOrder(targetProductId)) {
              // вывести алерт
            }
          } else {
            alert('Эти вкусняшки кончились!'); // eslint-disable-line
          }
        }
      });
    });
  });

  window.order.manageOrderForm();
  window.order.validateForm();
  window.order.submitForm();

})();
