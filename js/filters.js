'use strict';

(function () {

  var domRangeFilter = document.querySelector('.range__filter');
  var domFilterMin = domRangeFilter.querySelector('button.range__btn--left');
  var domFilterMax = domRangeFilter.querySelector('button.range__btn--right');
  var domFilterFill = domRangeFilter.querySelector('.range__fill-line');
  var domPriceMin = document.querySelector('.range__price.range__price--min');
  var domPriceMax = document.querySelector('.range__price.range__price--max');
  var MAX_WIDTH = domRangeFilter.offsetWidth;

  function onMouseDown(evtDown) {
    var startCoord = {
      x: evtDown.clientX
    };
    var eventTarget = evtDown.target;

    function onMouseMove(evt) {
      evt.preventDefault();
      if (eventTarget === domFilterMin || eventTarget === domFilterMax) {
        var shift = {
          x: startCoord.x - evt.clientX
        };

        startCoord = {
          x: evt.clientX
        };

        // устанавливаем диапазоны сдвига и само движение
        if (eventTarget === domFilterMin) {
          if (domFilterMin.offsetLeft - shift.x >= 0 && domFilterMin.offsetLeft - shift.x < (domFilterMax.offsetLeft - 8)) {
            domFilterMin.style.left = (domFilterMin.offsetLeft - shift.x) + 'px';
            domFilterFill.style.left = (domFilterMin.offsetLeft - shift.x + 5) + 'px';
            domPriceMin.innerText = domFilterMin.offsetLeft - shift.x;
          }
        } else {
          if (domFilterMax.offsetLeft - shift.x <= MAX_WIDTH - 10 && domFilterMax.offsetLeft - shift.x > (domFilterMin.offsetLeft + 8)) {
            domFilterMax.style.left = (domFilterMax.offsetLeft - shift.x) + 'px';
            domFilterFill.style.right = MAX_WIDTH - (domFilterMax.offsetLeft - shift.x + 5) + 'px';
            domPriceMax.innerText = domFilterMax.offsetLeft - shift.x;
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

  domFilterMin.addEventListener('mousedown', onMouseDown);
  domFilterMax.addEventListener('mousedown', onMouseDown);

})();
