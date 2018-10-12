'use strict';

(function () {

  /**
   * Алгоритм добавления/удаления из корзины будет следующий:
   * 1. у нас уже есть массив объектов товаров из мок объекта (в дальнейшем из json). Нужно добавить productId для манипуляций с объектами
   * 2. при нажатии на добавить в корзину, функция будет проверять количество доступных товаров в соответствующем объекте списка товаров,
   *   если есть, уменьшать на 1 и проверять наличие соответствующего товара в массиве объектов заказанных товаров, если есть, увеличивать на 1, если нет, копировать объект в массив заказанных товаров.
   * 3. отрисовка оъектов (количества и если новый то добавление в дом нового объекта корзины)
   */
  var dom = window.dom;
  window.catalog = {};
  // работа с корзиной
  window.catalog.manageOrderedProducts = function () {
    var orderedProducts = dom.cartCards.querySelectorAll('article.goods_card.card-order');
    if (orderedProducts && orderedProducts.length > 0) {
      orderedProducts.forEach(function (product) {
        product.addEventListener('click', function (evt) {
          var targetProductId = product.dataset.cartproductid;
          if (evt.target.classList.contains('card-order__close')) {
            evt.preventDefault();

            // нажали на крестик, удаляем объект из массива и восстанавливаем исходный объект и перерисовываем
            window.buffer[targetProductId].amount += window.productsOrderedArr[targetProductId].orderedAmount;
            delete window.productsOrderedArr[targetProductId];
            window.data.renderCardsCart(window.productsOrderedArr);
          }
          if (evt.target.classList.contains('card-order__btn--decrease')) {
            // нажали уменьшить, уменьшаем orderedAmount объекта из массива, прибавляем к исходному и перерисовываем
            if (window.productsOrderedArr[targetProductId].orderedAmount > 1) {
              window.productsOrderedArr[targetProductId].orderedAmount--;
              window.buffer[targetProductId].amount++;
            }
            window.data.renderCardsCart(window.productsOrderedArr);
          }
          if (evt.target.classList.contains('card-order__btn--increase')) {
            // аналогично
            if (window.productsOrderedArr[targetProductId].orderedAmount <= window.buffer[targetProductId].amount) {
              window.productsOrderedArr[targetProductId].orderedAmount++;
              window.buffer[targetProductId].amount--;
              window.data.renderCardsCart(window.productsOrderedArr);
            } else {
              alert('А попа не слипнится?) Усе закончилось.'); // eslint-disable-line
            }
          }
        });
      });
    }
  };

  window.catalog.checkPriceAndDecreaseAmount = function (id) {
    if (window.buffer[id].amount > 0) {
      return true;
    }
    return false;
  };

  window.catalog.checkAndInsertOrder = function (id) {
    if (window.productsOrderedArr.length > 0 && window.productsOrderedArr[id] && window.productsOrderedArr[id].hasOwnProperty('orderedAmount')) {
      // увеличиваем свойство количества в объекте заказанных товаров
      window.productsOrderedArr[id].orderedAmount++;
      window.buffer[id].amount--;
    } else {
      // добавляем объект в массив объектов в корзине
      window.productsOrderedArr[id] = Object.assign({}, window.buffer[id]);
      window.productsOrderedArr[id].orderedAmount = 1;
      // удаляем ненужное свойство которое изменяется в оригинальном объекте, а тут скопировано статичное
      delete window.productsOrderedArr[id].amount;
    }
    window.data.renderCardsCart(window.productsOrderedArr);
  };
})();
