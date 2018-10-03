'use strict';

(function () {

  var MAX_GOODS = 26;

  var domCatalogCards = document.querySelector('.catalog__cards');
  var domCartCards = document.querySelector('.goods__cards');

  var fragmentCardTemplate = document.querySelector('#card');
  var fragmentCartTemplate = document.querySelector('#card-order');

  var domHeaderBasket = document.querySelector('.main-header__basket');
  var domOrderTotal = document.querySelector('.goods__total');
  var domOrderTotalContent = domOrderTotal.querySelector('.goods__card-wrap .goods__total-count');

  var domFormOrder = document.querySelector('form[name=order]');
  var domSectionOrder = domFormOrder.querySelector('section.order');
  var domInputEmail = domFormOrder.querySelector('input[name=email]');
  var domInputCardNumber = domFormOrder.querySelector('input[name=card-number]');

  var domSubmitOrder = document.querySelector('.buy__submit-btn-wrap.container');

  var mockContainer = {
    name: ['Чесночные сливки', 'Огуречный педант', 'Молочная хрюша', 'Грибной шейк', 'Баклажановое безумие', 'Паприколу итальяно', 'Нинзя-удар васаби', 'Хитрый баклажан', 'Горчичный вызов', 'Кедровая липучка', 'Корманный портвейн', 'Чилийский задира', 'Беконовый взрыв', 'Арахис vs виноград', 'Сельдерейная душа', 'Початок в бутылке', 'Чернющий мистер чеснок', 'Раша федераша', 'Кислая мина', 'Кукурузное утро', 'Икорный фуршет', 'Новогоднее настроение', 'С пивком потянет', 'Мисс креветка', 'Бесконечный взрыв', 'Невинные винные', 'Бельгийское пенное', 'Острый язычок'
    ],
    picture: ['gum-cedar.jpg', 'gum-chile.jpg', 'gum-eggplant.jpg', 'gum-mustard.jpg', 'gum-portwine.jpg', 'gum-wasabi.jpg', 'ice-cucumber.jpg', 'ice-eggplant.jpg', 'ice-garlic.jpg', 'ice-italian.jpg', 'ice-mushroom.jpg', 'ice-pig.jpg', 'marmalade-beer.jpg', 'marmalade-caviar.jpg', 'marmalade-corn.jpg', 'marmalade-new-year.jpg', 'marmalade-sour.jpg', 'marshmallow-bacon.jpg', 'marshmallow-beer.jpg', 'marshmallow-shrimp.jpg', 'marshmallow-spicy.jpg', 'marshmallow-wine.jpg', 'soda-bacon.jpg', 'soda-celery.jpg', 'soda-cob.jpg', 'soda-garlic.jpg', 'soda-peanut-grapes.jpg', 'soda-russian.jpg'],
    sugar: [false, true],
    contents: ['молоко', 'сливки', 'вода', 'пищевой краситель', 'патока', 'ароматизатор бекона', 'ароматизатор свинца', 'ароматизатор дуба, идентичный натуральному', 'ароматизатор картофеля', 'лимонная кислота', 'загуститель', 'эмульгатор', 'консервант: сорбат калия', 'посолочная смесь: соль, нитрит натрия', 'ксилит', 'карбамид', 'вилларибо', 'виллабаджо']
  };

  function getRandValue(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  }

  function getRandElement(arr) {
    return Math.floor(Math.random() * arr.length);
  }

  function getRandElements(arr, count) {
    // count количество случайных элементов массива
    var result = [];
    for (var i = 0; i < count; i++) {
      result[i] = arr[getRandElement(arr)];
    }
    return result.join(', ');
  }

  function plural(number, arrCase) {
    var cases = [2, 0, 1, 1, 1, 2];
    return arrCase[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }

  function clearChildNodes(element) {
    if (element.hasChildNodes()) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }

  // алгоритм Луна
  function luhnFilter(cardNumber) {
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
  }

  function generateMockObjects() {
    var arrGoods = [];
    for (var i = 0; i < MAX_GOODS; i++) {
      arrGoods[i] = {
        productId: i,
        name: mockContainer.name[getRandElement(mockContainer.name)],
        picture: mockContainer.picture[getRandElement(mockContainer.picture)],
        amount: getRandValue(0, 20),
        price: getRandValue(100, 1500),
        weight: getRandValue(30, 300),
        rating: {
          number: getRandValue(10, 900),
          value: getRandValue(1, 5)
        },
        nutritionFacts: {
          sugar: mockContainer.sugar[getRandElement(mockContainer.sugar)],
          energy: getRandValue(70, 500),
          contents: getRandElements(mockContainer.contents, 7)
        }
      };
    }
    return arrGoods;
  }

  function renderCards(products) {
    if (domCatalogCards) {
      domCatalogCards.classList.remove('catalog__cards--load');
      domCatalogCards.querySelector('.catalog__load').classList.add('visually-hidden');
    }

    var cardNode = fragmentCardTemplate.content;

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
    domCatalogCards.appendChild(cardsListContainer);
  }

  function renderCardsCart(productsOrdered) {
    // productsOrdered проверяем на пустые элементы
    var bufferArr = productsOrdered.filter(function (item) {
      return item.hasOwnProperty('name');
    });
    // в буфер скидываем заглушку т.к. далее все дети будут удалятся перед вставкой
    var bufferNodeEmpty = domCartCards.querySelector('.goods__card-empty');
    if (bufferNodeEmpty) {
      bufferNodeEmpty = bufferNodeEmpty.cloneNode(true);
    }

    if (bufferArr.length > 0) {
      var cartNode = fragmentCartTemplate.content;
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
      clearChildNodes(domCartCards);
      cartListContainer.appendChild(bufferNodeEmpty);

      domCartCards.appendChild(cartListContainer);

      // манипуляции с классами
      domCartCards.classList.remove('goods__cards--empty');
      domCartCards.querySelector('.goods__card-empty').classList.add('visually-hidden');
      domOrderTotal.classList.remove('visually-hidden');
      // убираем скрытие формы заказа, если она скрыта и кнопки отправки
      if (domSectionOrder.classList.contains('visually-hidden')) {
        domSectionOrder.classList.remove('visually-hidden');
      }
      if (domSubmitOrder.classList.contains('visually-hidden')) {
        domSubmitOrder.classList.remove('visually-hidden');
      }

      // функция управления элементами в корзине
      manageOrderedProducts();

    } else {
      // нет товаров в корзине, чистим дом и возвращаем заглушку
      clearChildNodes(domCartCards);
      if (!domCartCards.classList.contains('goods__cards--empty')) {
        domCartCards.classList.add('goods__cards--empty');
      }
      domCartCards.appendChild(bufferNodeEmpty);
      domCartCards.querySelector('.goods__card-empty').classList.remove('visually-hidden');
      domOrderTotal.classList.add('visually-hidden');
      // добавляем скрытие формы заказа кнопки отправки
      if (!domSectionOrder.classList.contains('visually-hidden')) {
        domSectionOrder.classList.add('visually-hidden');
      }
      if (!domSubmitOrder.classList.contains('visually-hidden')) {
        domSubmitOrder.classList.add('visually-hidden');
      }
    }
    // добавляем в шапку и итоговую стоимость при оформлении
    if (priceResult) {
      var strBasket = 'В корзине ' + countOrderedItems + ' товар' + plural(countOrderedItems, ['', 'а', 'ов']) + ' на ' + priceResult + '₽';
      domHeaderBasket.textContent = strBasket;
      domOrderTotalContent.innerHTML = 'Итого за ' + countOrderedItems + ' товар' + plural(countOrderedItems, ['', 'а', 'ов']) + ': <span class="goods__price">' + priceResult + ' ₽</span>';
    } else {
      domHeaderBasket.textContent = 'В корзине ничего нет';
      domOrderTotalContent.innerHTML = 'Итого за 0 товаров: <span class="goods__price">0 ₽</span>';
    }
  }

  function checkPriceAndDecreaseAmount(id) {
    if (productsArray[id].amount > 0) {
      productsArray[id].amount--;
      return true;
    }
    return false;
  }

  function checkAndInsertOrder(id) {
    if (productsOrderedArr.length > 0 && productsOrderedArr[id] && productsOrderedArr[id].hasOwnProperty('orderedAmount')) {
      // увеличиваем свойство количества в объекте заказанных товаров
      productsOrderedArr[id].orderedAmount++;
    } else {
      // добавляем объект в массив объектов в корзине
      productsOrderedArr[id] = Object.assign({}, productsArray[id]);
      productsOrderedArr[id].orderedAmount = 1;
      // удаляем ненужное свойство которое изменяется в оригинальном объекте, а тут скопировано статичное
      delete productsOrderedArr[id].amount;
    }
    renderCardsCart(productsOrderedArr);
  }

  // работа с корзиной
  function manageOrderedProducts() {
    var orderedProducts = domCartCards.querySelectorAll('article.goods_card.card-order');
    if (orderedProducts && orderedProducts.length > 0) {
      orderedProducts.forEach(function (product) {
        product.addEventListener('click', function (evt) {
          var targetProductId = product.dataset.cartproductid;
          if (evt.target.classList.contains('card-order__close')) {
            evt.preventDefault();
            // нажали на крестик, удаляем объект из массива и перерисовываем
            delete productsOrderedArr[targetProductId];
            renderCardsCart(productsOrderedArr);
          }
          if (evt.target.classList.contains('card-order__btn--decrease')) {
            // нажали уменьшить, уменьшаем orderedAmount объекта из массива и перерисовываем
            if (productsOrderedArr[targetProductId].orderedAmount > 1) {
              productsOrderedArr[targetProductId].orderedAmount--;
            }
            renderCardsCart(productsOrderedArr);
          }
          if (evt.target.classList.contains('card-order__btn--increase')) {
            // аналогично
            if (productsOrderedArr[targetProductId].orderedAmount <= productsArray[targetProductId].amount) {
              productsOrderedArr[targetProductId].orderedAmount++;
              renderCardsCart(productsOrderedArr);
            } else {
              alert('А попа не слипнится?) Усе закончилось.'); // eslint-disable-line
            }
          }
        });
      });
    }
  }

  // работа с формой заказа
  function manageOrderForm() {
    var domCashWrap = domFormOrder.querySelector('.payment__cash-wrap');
    domFormOrder.addEventListener('click', function (evt) {
      var evtTarget = evt.target;
      // если переключились на наличные, блокируем инпуты кредитки и обратно
      if (evtTarget.getAttribute('id') === 'payment__card' || evtTarget.getAttribute('id') === 'payment__cash') {
        var сard = {
          number: domFormOrder.querySelector('input[name=card-number]'),
          date: domFormOrder.querySelector('input[name=card-date]'),
          cvc: domFormOrder.querySelector('input[name=card-cvc]'),
          holder: domFormOrder.querySelector('input[name=cardholder]')
        };
        for (var field in сard) {
          if (сard[field].disabled && !domFormOrder.querySelector('input#payment__cash').checked) {
            сard[field].disabled = false;
            domCashWrap.classList.add('visually-hidden');
          } else if (domFormOrder.querySelector('input#payment__cash').checked) {
            сard[field].disabled = true;
            domCashWrap.classList.remove('visually-hidden');
          }
        }
      }
      // переключатель табов доставки
      if (evtTarget.getAttribute('id') === 'deliver__courier' || evtTarget.getAttribute('id') === 'deliver__store') {
        var domDeliveryStore = domFormOrder.querySelector('.deliver__store');
        var domDeliveryCourier = domFormOrder.querySelector('.deliver__courier');
        var activeDeliveryTab = domFormOrder.querySelector('.' + evtTarget.getAttribute('id'));
        if (activeDeliveryTab.isEqualNode(domDeliveryCourier)) {
          domDeliveryStore.classList.add('visually-hidden');
          domDeliveryCourier.classList.remove('visually-hidden');
        } else {
          domDeliveryStore.classList.remove('visually-hidden');
          domDeliveryCourier.classList.add('visually-hidden');
        }
      }
    });
  }

  function manageFilters() {
    var totalVal = 245;
    var rangeMouseFilter = document.querySelector('.range__filter');
    var domFilterMin = rangeMouseFilter.querySelector('button.range__btn--left');
    var domFilterMax = rangeMouseFilter.querySelector('button.range__btn--right');
    rangeMouseFilter.addEventListener('mouseup', function (evt) {
      var ratio = evt.offsetX / totalVal;
      var res = ratio * 100;
      domFilterMin.setAttribute('data-min', res);
      domFilterMax.setAttribute('data-max', 100 - res);
    });
  }

  function validateOrderForm() {
    domInputEmail.addEventListener('keyup', function () {
      if (domInputEmail.value) {
        domInputEmail.type = 'email';
        domInputEmail.required = true;
      } else {
        domInputEmail.type = 'text';
        domInputEmail.required = false;
      }
    });

    domInputCardNumber.addEventListener('keyup', function () {
      if (domInputCardNumber.value.length === 16) {
        if (!luhnFilter(domInputCardNumber.value)) {
          domInputCardNumber.setCustomValidity('Неправильно указан номер карты');
        }
      } else {
        domInputCardNumber.setCustomValidity('');
      }
    });
  }

  // start
  /**
   * Алгоритм добавления/удаления из корзины будет следующий:
   * 1. у нас уже есть массив объектов товаров из мок объекта (в дальнейшем из json). Нужно добавить productId для манипуляций с объектами
   * 2. при нажатии на добавить в корзину, функция будет проверять количество доступных товаров в соответствующем объекте списка товаров,
   *   если есть, уменьшать на 1 и проверять наличие соответствующего товара в массиве объектов заказанных товаров, если есть, увеличивать на 1, если нет, копировать объект в массив заказанных товаров.
   * 3. отрисовка оъектов (количества и если новый то добавление в дом нового объекта корзины)
   */
  var productsArray = generateMockObjects();
  var productsOrderedArr = [];

  renderCards(productsArray);

  // эвенты
  var buttonsFavorite = domCatalogCards.querySelectorAll('.card__btn-favorite');
  buttonsFavorite.forEach(function (button) {
    button.addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.target.classList.toggle('card__btn-favorite--selected');
    });
  });

  var buttonsOrder = domCatalogCards.querySelectorAll('.card__btn');
  buttonsOrder.forEach(function (button) {
    button.addEventListener('click', function (evt) {
      evt.preventDefault();
      // получаем дом объект нажатого товара и вытаскиваем id товара для поиска и манипуляций в js объектах
      var targetProductId = evt.path[3].dataset.productid;
      if (targetProductId) {
        if (checkPriceAndDecreaseAmount(targetProductId)) {
          // если есть в наличии
          if (!checkAndInsertOrder(targetProductId)) {
            // вывести алерт
          }
        } else {
          alert('Эти вкусняшки кончились!'); // eslint-disable-line
        }
      }
    });
  });

  manageOrderForm();
  manageFilters();
  validateOrderForm();

})();
