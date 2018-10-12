'use strict';

(function () {
  var MAX_WIDTH = window.dom.sliderRange.offsetWidth;
  window.filter = {};

  var onMouseDown = function (evtDown) {
    var startCoord = {
      x: evtDown.clientX
    };
    var eventTarget = evtDown.target;

    function onMouseMove(evt) {
      evt.preventDefault();
      if (eventTarget === window.dom.sliderMin || eventTarget === window.dom.sliderMax) {
        var shift = {
          x: startCoord.x - evt.clientX
        };

        startCoord = {
          x: evt.clientX
        };

        // устанавливаем диапазоны сдвига и само движение
        if (eventTarget === window.dom.sliderMin) {
          if (window.dom.sliderMin.offsetLeft - shift.x >= 0 && window.dom.sliderMin.offsetLeft - shift.x < (window.dom.sliderMax.offsetLeft - 8)) {
            window.dom.sliderMin.style.left = (window.dom.sliderMin.offsetLeft - shift.x) + 'px';
            window.dom.sliderFill.style.left = (window.dom.sliderMin.offsetLeft - shift.x + 5) + 'px';
            window.dom.sliderPriceMin.innerText = window.dom.sliderMin.offsetLeft - shift.x;
          }
        } else {
          if (window.dom.sliderMax.offsetLeft - shift.x <= MAX_WIDTH - 10 && window.dom.sliderMax.offsetLeft - shift.x > (window.dom.sliderMin.offsetLeft + 8)) {
            window.dom.sliderMax.style.left = (window.dom.sliderMax.offsetLeft - shift.x) + 'px';
            window.dom.sliderFill.style.right = MAX_WIDTH - (window.dom.sliderMax.offsetLeft - shift.x + 5) + 'px';
            window.dom.sliderPriceMax.innerText = window.dom.sliderMax.offsetLeft - shift.x;
          }
        }
      }
    }

    function onMouseUp(evt) {
      evt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  };

  window.filter.renderCounts = function (productsArray) {
    // тут немного рукожопский подход, а как по другому сделать, пока не очень понимаю
    // по идее нужна какая то структура данных или чтобы из сгенерированной сервером страницы можно было вытащить какие то аттрибуты для сопоставления
    var countersList = window.dom.sidebarFilter.querySelectorAll('li.input-btn,p.range__price-count');
    var count;
    if (countersList) {
      for (var i = 0; i < countersList.length; i++) {
        var spanCounter = countersList[i].querySelector('span');
        if (countersList[i].childNodes[1].nodeName === 'INPUT' || countersList[i].childNodes[1].nodeName === 'SPAN') {
          var inputValue = countersList[i].childNodes[1].value;
          var spanText = countersList[i].childNodes[1];
          // куча повторяющегося кода, но времени не было весь этот трешак структурировать
          if (inputValue === 'icecream') {
            count = productsArray.filter(function (it) {
              return it.kind === 'Мороженое';
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'soda') {
            count = productsArray.filter(function (it) {
              return it.kind === 'Газировка';
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'gum') {
            count = productsArray.filter(function (it) {
              return it.kind === 'Жевательная резинка';
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'marmalade') {
            count = productsArray.filter(function (it) {
              return it.kind === 'Мармелад';
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'marshmallows') {
            count = productsArray.filter(function (it) {
              return it.kind === 'Зефир';
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'sugar-free') {
            count = productsArray.filter(function (it) {
              return it.nutritionFacts.sugar === false;
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'vegetarian') {
            count = productsArray.filter(function (it) {
              return it.nutritionFacts.vegetarian === true;
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'gluten-free') {
            count = productsArray.filter(function (it) {
              return it.nutritionFacts.gluten === false;
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          // счетчик над слайдером, считает весь массив
          if (countersList[i].childNodes[1].classList.contains('range__count')) {
            count = productsArray.length;
            spanText.textContent = '(' + count + ')';
          }
          if (inputValue === 'favorite') {
            count = productsArray.filter(function (it) {
              return it.favorite !== 0;
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
          if (inputValue === 'availability') {
            count = productsArray.filter(function (it) {
              return it.amount !== 0;
            }).length;
            spanCounter.textContent = '(' + count + ')';
          }
        }
      }
    }
  };

  window.dom.sliderMin.addEventListener('mousedown', onMouseDown);
  window.dom.sliderMax.addEventListener('mousedown', onMouseDown);

  window.dom.filterInputs.forEach(function (input) {
    input.addEventListener('click', function () {
      if (window.buffer) {
        // дабы не городить огород, алгоритм следующий:
        // при клике на инпуте, проверяется состояние всех чекбоксов
        // заносятся в переменную и при формировании фильтра будут участвовать в условиях выдачи
        // фильтром формируется буферный объект из исходного
        var checkeds = [];
        for (var i = 0; i < window.dom.filterInputs.length; i++) {
          if (window.dom.filterInputs[i].checked) {
            checkeds = checkeds.concat(window.dom.filterInputs[i].value);
          }
        }
        // поскольку у чекбоксов и объекта нет явного сопоставления значений, делаю хардкодом
        // не уверен что так правильно, делаю по типу формирования sql запроса в бд))
        window.buffer = productsArray.filter(function (item) { // eslint-disable-line
          var resStr = '';
          // Блок типов товара
          if (checkeds.indexOf('icecream') !== -1) { // тыкнули на Мороженое
            resStr = 'item.kind === "Мороженое"';
          }
          if (checkeds.indexOf('soda') !== -1) { // тыкнули на Газировка и т.д.
            resStr += (resStr ? ' || ' : '') + ' item.kind === "Газировка"';
          }
          if (checkeds.indexOf('gum') !== -1) {
            resStr += (resStr ? ' || ' : '') + ' item.kind === "Жевательная резинка"';
          }
          if (checkeds.indexOf('marmalade') !== -1) {
            resStr += (resStr ? ' || ' : '') + ' item.kind === "Мармелад"';
          }
          if (checkeds.indexOf('marshmallows') !== -1) {
            resStr += (resStr ? ' || ' : '') + ' item.kind === "Зефир"';
          }
          resStr = resStr ? '(' + resStr + ')' : '';
          // Блок содержания в товарах
          if (checkeds.indexOf('sugar-free') !== -1) { // && без сахара
            resStr += (resStr ? ' && ' : '') + ' item.nutritionFacts.sugar === false';
          }
          if (checkeds.indexOf('vegetarian') !== -1) {
            resStr += (resStr ? ' && ' : '') + ' item.nutritionFacts.vegetarian === true';
          }
          if (checkeds.indexOf('gluten-free') !== -1) {
            resStr += (resStr ? ' && ' : '') + ' item.nutritionFacts.gluten === false';
          }
          return eval(resStr); // eslint-disable-line
        });
        // финт ушами, нужно id поменять из индекса т.к. раньше это использовалось во всей логике
        window.buffer.forEach(function (it, ind) {
          it.productId = ind;
        });
        window.data.renderCards(window.buffer);
        window.filter.renderCounts(window.buffer);
      }
    });
  });

})();
