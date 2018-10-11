'use strict';

(function () {
  var MAX_WIDTH = window.dom.sliderRange.offsetWidth;

  function onMouseDown(evtDown) {
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

  }

  window.dom.sliderMin.addEventListener('mousedown', onMouseDown);
  window.dom.sliderMax.addEventListener('mousedown', onMouseDown);

  window.buffer = [];

  window.dom.filterInputs.forEach(function (input) {
    input.addEventListener('click', function (evt) {
      if (window.bufferArray) {
        // делим фильтры на группы
        // главная - Типы товаров - использует копию основного объекта
        // вторая - Содержание - для фильтрации использует объект главной группы
        /* если тыкнули по инпуту, получаем из исходного объекта массив по этому фильтру
           накладываем (мапируем) на буфферный массив, если такие объекты там есть, удаляем из буффера,
           если их нет, добавляем в буффер
        */
        var filterLabel = evt.target.parentNode.childNodes[3].textContent;
        var filterChecked = evt.target.checked;
        var filterIds = [];

        var filterTypes = function () {
          var filterTypeArr = window.productsArray.filter(function (it) { // eslint-disable-line
            if (it.kind === filterLabel) {
              filterIds.push(it.productId);
              return it;
            }
          });
          if (filterChecked) {
            // добавляем
            window.buffer = window.buffer.concat(filterTypeArr);
            window.buffer = window.buffer.filter(function (it, i) { // eslint-disable-line
              return window.buffer.indexOf(it) === i;
            });
          } else {
            // удаляем
            return window.buffer.filter(function (item) { // eslint-disable-line
              if (filterIds.indexOf(item.productId) === -1) {
                return item;
              }
            });
          }
        };

        var filterContent = function () {
          // поскольку для фильтров нет сопоставлений кнопки и объекта, прописываем их хардкодом
          var filterNutrition = function (it) { // eslint-disable-line
            if (filterLabel === 'Без сахара' && it.nutritionFacts.sugar === false) {
              filterIds.push(it.productId);
              return it;
            }
            if (filterLabel === 'Вегетарианское' && it.nutritionFacts.vegetarian === true) {
              filterIds.push(it.productId);
              return it;
            }
            if (filterLabel === 'Безглютеновое' && it.nutritionFacts.vegetarian === true) {
              filterIds.push(it.productId);
              return it;
            }
          };

          var filterNutritionArr = function () {
            // фильтрация по содержанию если буферный объект пустой, берем из исходного, если не пустой, фильтруем по буферу
            if (window.buffer.length > 0) {
              return window.buffer.filter(function (it) {
                return filterNutrition(it);
              });
            } else {
              return window.productsArray.filter(function (it) {
                return filterNutrition(it);
              });
            }
          };
        };

        window.buffer = filterTypes();

        //console.log(window.buffer);
      }
    });
  });

})();
