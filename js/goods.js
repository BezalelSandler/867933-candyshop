'use strict';

(function () {

  var MAX_GOODS = 26;

  var mockContainer = {
    name: ['Чесночные сливки','Огуречный педант','Молочная хрюша','Грибной шейк','Баклажановое безумие','Паприколу итальяно','Нинзя-удар васаби','Хитрый баклажан','Горчичный вызов','Кедровая липучка','Корманный портвейн','Чилийский задира','Беконовый взрыв','Арахис vs виноград','Сельдерейная душа','Початок в бутылке','Чернющий мистер чеснок','Раша федераша','Кислая мина','Кукурузное утро','Икорный фуршет','Новогоднее настроение','С пивком потянет','Мисс креветка','Бесконечный взрыв','Невинные винные','Бельгийское пенное','Острый язычок'
    ],
    picture: ['gum-cedar.jpg','gum-chile.jpg','gum-eggplant.jpg','gum-mustard.jpg','gum-portwine.jpg','gum-wasabi.jpg','ice-cucumber.jpg','ice-eggplant.jpg','ice-garlic.jpg','ice-italian.jpg','ice-mushroom.jpg','ice-pig.jpg','marmalade-beer.jpg','marmalade-caviar.jpg','marmalade-corn.jpg','marmalade-new-year.jpg','marmalade-sour.jpg','marshmallow-bacon.jpg','marshmallow-beer.jpg','marshmallow-shrimp.jpg','marshmallow-spicy.jpg','marshmallow-wine.jpg','soda-bacon.jpg','soda-celery.jpg','soda-cob.jpg','soda-garlic.jpg','soda-peanut-grapes.jpg','soda-russian.jpg'],
    sugar: [false,true],
    contents: ['молоко','сливки','вода','пищевой краситель','патока','ароматизатор бекона','ароматизатор свинца','ароматизатор дуба, идентичный натуральному','ароматизатор картофеля','лимонная кислота','загуститель','эмульгатор','консервант: сорбат калия','посолочная смесь: соль, нитрит натрия','ксилит','карбамид','вилларибо','виллабаджо'
      ]
  };

  function getRandValue(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

  function getRandElement(arr) {
    return Math.floor(Math.random() * arr.length);
  }

  function getRandElements(arr, count) {
    // count количество случайных элементов массива
    var result = [];
    for(var i=0; i<count; i++){
      result[i] = arr[getRandElement(arr)];
    }
    return result.join(', ');
  }

  function generateMockObjects() {
    var arrGoods = [];
    for(var i=0; i<MAX_GOODS; i++){
      arrGoods[i] = {
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

  function renderCards() {
    var catalogCards = document.querySelector('.catalog__cards');
    if(catalogCards){
      catalogCards.classList.remove('catalog__cards--load');
      document.querySelector('.catalog__load').classList.add('visually-hidden');
    }

    var cardTemplate = document.querySelector('#card');
    var cardNode = cardTemplate.content;

    var cardsListContainer = document.createDocumentFragment();

    mockObjects.forEach(function (item) {
      var amountClass = cardNode.querySelector('.catalog__card.card').classList;
      if(item.amount === 0){
        amountClass[2] === 'card--in-stock' ? amountClass.remove('card--in-stock') : false;
        amountClass.add('card--soon');
      }
      if(item.amount > 0 && item.amount <=5){
        amountClass[2] === 'card--in-stock' ? amountClass.remove('card--in-stock') : false;
        amountClass.add('card--little');
      }

      cardNode.querySelector('.card__title').innerText = item.name;
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
      cardNode.querySelector('.star__count').innerText = item.rating.number;

      var sugarValue = cardNode.querySelector('.card__characteristic');
      sugarValue.innerText = 'Без сахара';
      if(item.nutritionFacts.sugar){
        sugarValue.innerText = 'Содержит сахар. ' + item.nutritionFacts.energy + ' ккал';
      }
      cardNode.querySelector('.card__composition-list').innerText = item.nutritionFacts.contents;

      cardsListContainer.appendChild(cardNode.cloneNode(true));
    });
    document.querySelector('.catalog__cards').appendChild(cardsListContainer);
  }

  function renderCardsCart(){
    var cartTemplate = document.querySelector('#card-order');
    var cartNode = cartTemplate.content;

    var cartListContainer = document.createDocumentFragment();

    for(var i=0; i<3; i++){
      cartNode.querySelector('.card-order__title').innerText = mockObjects[i].name;
      cartNode.querySelector('.card-order__img').src = 'img/cards/' + mockObjects[i].picture;
      cartNode.querySelector('.card-order__price').innerText = mockObjects[i].price + ' ₽';
      cartListContainer.appendChild(cartNode.cloneNode(true));
    }
    document.querySelector('.goods__cards').appendChild(cartListContainer);
    document.querySelector('.goods__cards').classList.remove('goods__cards--empty');
    document.querySelector('.goods__card-empty').classList.add('visually-hidden');
  }

  // start
  var mockObjects = generateMockObjects();

  renderCards();
  renderCardsCart();


})();
