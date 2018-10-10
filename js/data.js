'use strict';

(function () {
  var dom = window.dom;
  var utils = window.utils;
  window.data = {};

  window.data.generateProducts = function (onResult) {
    window.backend.load(
        function (response) {
        // onLoad
          var arrGoods = [];
          if (typeof response === 'object') {
            for (var i = 0; i < response.length; i++) {
              arrGoods[i] = {
                productId: i,
                name: response[i].name,
                picture: response[i].picture,
                amount: response[i].amount,
                price: response[i].price,
                weight: response[i].weight,
                rating: {
                  number: response[i].rating.number,
                  value: response[i].rating.value
                },
                nutritionFacts: {
                  sugar: response[i].nutritionFacts.sugar,
                  energy: response[i].nutritionFacts.energy,
                  contents: response[i].nutritionFacts.contents
                }
              };
            }
          }
          onResult(arrGoods);
        },
        function (response) {
        // onError
          alert(response); // eslint-disable-line
        });
  };

  window.data.renderCards = function (products) {
    if (dom.catalogCards) {
      dom.catalogCards.classList.remove('catalog__cards--load');
      dom.catalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
    }

    var cardNode = dom.fragmentCardTemplate.content;

    var cardsListContainer = document.createDocumentFragment();

    products.forEach(function (item) {
      var amountClass = cardNode.querySelector('.catalog__card.card').classList;
      if (item.amount === 0) {
        if (amountClass[2] === 'card--in-stock') {
          amountClass.remove('card--in-stock');
        }
        amountClass.add('card--soon');
      }
      if (item.amount > 0 && item.amount <= 5) {
        if (amountClass[2] === 'card--in-stock') {
          amountClass.remove('card--in-stock');
        }
        amountClass.add('card--little');
      }
      cardNode.querySelector('article').setAttribute('data-productid', item.productId);
      cardNode.querySelector('.card__title').textContent = item.name;
      cardNode.querySelector('.card__price').innerHTML = item.price + ' <span class="card__currency">₽</span><span class="card__weight">/ ' + item.weight + ' Г</span>';
      cardNode.querySelector('.card__img').src = 'img/cards/' + item.picture;

      var ratingClass = cardNode.querySelector('.stars__rating').classList;
      ratingClass.remove('stars__rating--five');
      switch (item.rating.value) {
        case 1: ratingClass.add('stars__rating--one'); break;
        case 2: ratingClass.add('stars__rating--two'); break;
        case 3: ratingClass.add('stars__rating--three'); break;
        case 4: ratingClass.add('stars__rating--four'); break;
        case 5: ratingClass.add('stars__rating--five'); break;
      }
      cardNode.querySelector('.star__count').textContent = item.rating.number;

      var sugarValue = cardNode.querySelector('.card__characteristic');
      sugarValue.textContent = 'Без сахара';
      if (item.nutritionFacts.sugar) {
        sugarValue.textContent = 'Содержит сахар. ' + item.nutritionFacts.energy + ' ккал';
      }
      cardNode.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;
      cardsListContainer.appendChild(cardNode.cloneNode(true));
    });
    dom.catalogCards.appendChild(cardsListContainer);
  };

  window.data.renderCardsCart = function (productsOrdered) {
    // productsOrdered проверяем на пустые элементы
    var bufferArr = productsOrdered.filter(function (item) {
      return item.hasOwnProperty('name');
    });
    // в буфер скидываем заглушку т.к. далее все дети будут удалятся перед вставкой
    var bufferNodeEmpty = dom.cartCards.querySelector('.goods__card-empty');
    if (bufferNodeEmpty) {
      bufferNodeEmpty = bufferNodeEmpty.cloneNode(true);
    }

    if (bufferArr.length > 0) {
      var cartNode = dom.fragmentCartTemplate.content;
      var priceResult = 0;
      var countOrderedItems = 0;

      var cartListContainer = document.createDocumentFragment();

      productsOrdered.forEach(function (item) {
        cartNode.querySelector('article').setAttribute('data-cartproductid', item.productId);
        cartNode.querySelector('.card-order__title').textContent = item.name;
        cartNode.querySelector('.card-order__img').src = 'img/cards/' + item.picture;
        cartNode.querySelector('.card-order__price').textContent = item.price + ' ₽';
        cartNode.querySelector('input[name=gum-wasabi]').value = item.orderedAmount;
        cartListContainer.appendChild(cartNode.cloneNode(true));
        // для подсчета в шапке
        priceResult += item.price * item.orderedAmount;
        countOrderedItems += item.orderedAmount;
      });
      // если уже есть объекты в корзине, удаляем при перерисовке, за исключением заглушки, заглушку в буфер
      utils.clearChildNodes(dom.cartCards);
      cartListContainer.appendChild(bufferNodeEmpty);

      dom.cartCards.appendChild(cartListContainer);

      // манипуляции с классами
      dom.cartCards.classList.remove('goods__cards--empty');
      dom.cartCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
      dom.orderTotal.classList.remove('visually-hidden');
      // убираем скрытие формы заказа, если она скрыта и кнопки отправки
      if (dom.sectionOrder.classList.contains('visually-hidden')) {
        dom.sectionOrder.classList.remove('visually-hidden');
      }
      if (dom.submitOrder.classList.contains('visually-hidden')) {
        dom.submitOrder.classList.remove('visually-hidden');
      }

      // функция управления элементами в корзине
      window.catalog.manageOrderedProducts();

    } else {
      // нет товаров в корзине, чистим дом и возвращаем заглушку
      utils.clearChildNodes(dom.cartCards);
      if (!dom.cartCards.classList.contains('goods__cards--empty')) {
        dom.cartCards.classList.add('goods__cards--empty');
      }
      dom.cartCards.appendChild(bufferNodeEmpty);
      dom.cartCards.querySelector('.goods__card-empty').classList.remove('visually-hidden');
      dom.orderTotal.classList.add('visually-hidden');
      // добавляем скрытие формы заказа кнопки отправки
      if (!dom.sectionOrder.classList.contains('visually-hidden')) {
        dom.sectionOrder.classList.add('visually-hidden');
      }
      if (!dom.submitOrder.classList.contains('visually-hidden')) {
        dom.submitOrder.classList.add('visually-hidden');
      }
    }
    // добавляем в шапку и итоговую стоимость при оформлении
    if (priceResult) {
      var strBasket = 'В корзине ' + countOrderedItems + ' товар' + utils.plural(countOrderedItems, ['', 'а', 'ов']) + ' на ' + priceResult + '₽';
      dom.headerBasket.textContent = strBasket;
      dom.orderTotalContent.innerHTML = 'Итого за ' + countOrderedItems + ' товар' + utils.plural(countOrderedItems, ['', 'а', 'ов']) + ': <span class="goods__price">' + priceResult + ' ₽</span>';
    } else {
      dom.headerBasket.textContent = 'В корзине ничего нет';
      dom.orderTotalContent.innerHTML = 'Итого за 0 товаров: <span class="goods__price">0 ₽</span>';
    }
  };


})();
