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
                kind: response[i].kind,
                amount: response[i].amount,
                price: response[i].price,
                weight: response[i].weight,
                favorite: 0,
                rating: {
                  number: response[i].rating.number,
                  value: response[i].rating.value
                },
                nutritionFacts: {
                  sugar: response[i].nutritionFacts.sugar,
                  energy: response[i].nutritionFacts.energy,
                  contents: response[i].nutritionFacts.contents,
                  vegetarian: response[i].nutritionFacts.vegetarian,
                  gluten: response[i].nutritionFacts.vegetarian
                }
              };
            }
          }
          var popularDefault = window.dom.sidebarFilter.querySelector('#filter-popular').checked;
          if (popularDefault) {
            arrGoods.sort(function (left, right) {
              return right.rating.number - left.rating.number;
            });
            arrGoods.forEach(function (it, ind) {
              it.productId = ind;
            });
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
      cardNode.querySelector('.card__btn-favorite').setAttribute('data-favorite', item.favorite);
      cardNode.querySelector('.card__btn-favorite').setAttribute('data-prodid', item.productId);

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
    window.utils.clearChildNodes(dom.catalogCards);

    dom.catalogCards.appendChild(cardsListContainer);

    var prices = [];
    window.filter.renderCounts(window.buffer);
    products.forEach(function (it, i) {
      prices[i] = it.price;
    });
    var min = Math.min.apply(null, prices);
    var max = Math.max.apply(null, prices);
    window.dom.sliderRange.querySelector('.range__btn--left').style.left = min + 'px';
    window.dom.sliderRange.querySelector('.range__btn--right').style.right = max + 'px';
    window.dom.sliderPriceMin.textContent = min;
    window.dom.sliderPriceMax.textContent = max;
    window.dom.sliderFill.style.left = min + 'px';
    window.dom.sliderFill.style.right = max + 'px';

    var buttonsFavorite = window.dom.catalogCards.querySelectorAll('.card__btn-favorite');
    buttonsFavorite.forEach(function (button) {
      button.addEventListener('click', function (evt) { // eslint-disable-line
        evt.preventDefault();
        evt.target.classList.toggle('card__btn-favorite--selected');
        var targetProductId = evt.target.dataset.prodid;
        window.buffer.forEach(function (it) {
          if (it.productId == targetProductId) { // eslint-disable-line
            if (it.favorite === 1) {
              it.favorite = 0;
            } else {
              it.favorite = 1;
            }
          }
        });
      });
    });

    var buttonsOrder = window.dom.catalogCards.querySelectorAll('.card__btn');
    buttonsOrder.forEach(function (button) {
      button.addEventListener('click', function (evt) { // eslint-disable-line
        evt.preventDefault();
        var targetProductId = evt.path[3].dataset.productid;
        if (targetProductId) {
          if (window.catalog.checkPriceAndDecreaseAmount(targetProductId)) {
            if (!window.catalog.checkAndInsertOrder(targetProductId)) {
              //
            }
          } else {
            alert('Эти вкусняшки кончились!'); // eslint-disable-line
          }
        }
      });
    });
  };

  window.data.renderCardsCart = function (productsOrdered) {
    var bufferArr = productsOrdered.filter(function (item) {
      return item.hasOwnProperty('name');
    });
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
      utils.clearChildNodes(dom.cartCards);
      cartListContainer.appendChild(bufferNodeEmpty);

      dom.cartCards.appendChild(cartListContainer);

      dom.cartCards.classList.remove('goods__cards--empty');
      dom.cartCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
      dom.orderTotal.classList.remove('visually-hidden');
      if (dom.sectionOrder.classList.contains('visually-hidden')) {
        dom.sectionOrder.classList.remove('visually-hidden');
      }
      if (dom.submitOrder.classList.contains('visually-hidden')) {
        dom.submitOrder.classList.remove('visually-hidden');
      }

      window.catalog.manageOrderedProducts();

    } else {
      utils.clearChildNodes(dom.cartCards);
      if (!dom.cartCards.classList.contains('goods__cards--empty')) {
        dom.cartCards.classList.add('goods__cards--empty');
      }
      dom.cartCards.appendChild(bufferNodeEmpty);
      dom.cartCards.querySelector('.goods__card-empty').classList.remove('visually-hidden');
      dom.orderTotal.classList.add('visually-hidden');
      if (!dom.sectionOrder.classList.contains('visually-hidden')) {
        dom.sectionOrder.classList.add('visually-hidden');
      }
      if (!dom.submitOrder.classList.contains('visually-hidden')) {
        dom.submitOrder.classList.add('visually-hidden');
      }
    }
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
