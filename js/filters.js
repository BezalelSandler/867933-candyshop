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
        /* если тыкнули по инпуту, получаем из исходного объекта массив по этому фильтру
           накладываем (мапируем) на буфферный массив, если такие объекты там есть, удаляем из буффера,
           если их нет, добавляем в буффер
        */
        var filterLabel = evt.target.parentNode.childNodes[3].textContent;
        var filterChecked = evt.target.checked;
        var filterIds = [];
        var filterTypeArr = window.productsArray.filter(function (it) { // eslint-disable-line
          if (it.kind === filterLabel) {
            filterIds.push(it.productId);
            return it;
          }
        });
        var filterNutritionFactsArr = window.productsArray.filter(function (it) { // eslint-disable-line
          if (evt.target.value === 'sugar-free') {
            if (it.nutritionFacts.sugar === false) {
              filterIds.push(it.productId);
              return it;
            }
          }
        });
        if (filterChecked) {
          // добавляем
          window.buffer = window.buffer.concat(filterTypeArr);
        } else {
          // удаляем
          window.buffer = window.buffer.filter(function (item) { // eslint-disable-line
            if (filterIds.indexOf(item.productId) === -1) {
              return item;
            }
          });
        }
        //console.log(filterIds);
        console.log(window.buffer);
      }
    });
  });

})();
