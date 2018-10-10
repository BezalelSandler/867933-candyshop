'use strict';

(function () {
  var dom = window.dom;
  // работа с формой заказа
  window.order.manageOrderForm = function () {
    dom.formOrder.addEventListener('click', function (evt) {
      var evtTarget = evt.target;
      // если переключились на наличные, блокируем инпуты кредитки и обратно
      if (evtTarget.getAttribute('id') === 'payment__card' || evtTarget.getAttribute('id') === 'payment__cash') {
        var card = {
          number: dom.formOrder.querySelector('input[name=card-number]'),
          date: dom.formOrder.querySelector('input[name=card-date]'),
          cvc: dom.formOrder.querySelector('input[name=card-cvc]'),
          holder: dom.formOrder.querySelector('input[name=cardholder]')
        };
        for (var field in card) {
          if (card[field].disabled && !dom.formOrder.querySelector('input#payment__cash').checked) {
            card[field].disabled = false;
            dom.cashWrap.classList.add('visually-hidden');
            dom.cardWrap.classList.remove('visually-hidden');
          } else if (dom.formOrder.querySelector('input#payment__cash').checked) {
            card[field].disabled = true;
            dom.cashWrap.classList.remove('visually-hidden');
            dom.cardWrap.classList.add('visually-hidden');
          }
        }
      }
      // переключатель табов доставки
      if (evtTarget.getAttribute('id') === 'deliver__courier' || evtTarget.getAttribute('id') === 'deliver__store') {
        var domDeliveryStore = dom.formOrder.querySelector('.deliver__store');
        var domDeliveryCourier = dom.formOrder.querySelector('.deliver__courier');
        var activeDeliveryTab = dom.formOrder.querySelector('.' + evtTarget.getAttribute('id'));
        if (activeDeliveryTab.isEqualNode(domDeliveryCourier)) {
          domDeliveryStore.classList.add('visually-hidden');
          domDeliveryCourier.classList.remove('visually-hidden');
        } else {
          domDeliveryStore.classList.remove('visually-hidden');
          domDeliveryCourier.classList.add('visually-hidden');
        }
      }
    });
  };

  window.order.validateForm = function () {
    dom.inputEmail.addEventListener('keyup', function () {
      if (dom.inputEmail.value) {
        dom.inputEmail.type = 'email';
        dom.inputEmail.required = true;
      } else {
        dom.inputEmail.type = 'text';
        dom.inputEmail.required = false;
      }
    });

    dom.inputCardNumber.addEventListener('keyup', function () {
      if (dom.inputCardNumber.value.length === 16) {
        if (!window.utils.luhnFilter(dom.inputCardNumber.value)) {
          dom.inputCardNumber.setCustomValidity('Неправильно указан номер карты');
        }
      } else {
        dom.inputCardNumber.setCustomValidity('');
      }
    });
    var domInputsCard = dom.cardWrap.querySelectorAll('input[type=text]');
    var totalInputs = domInputsCard.length;
    // вешаем события на каждый инпут и при смене фокуса проверяем валидность всех нужных инпутов
    domInputsCard.forEach(function (item) {
      item.addEventListener('blur', function () {
        var validFlag = 0;
        domInputsCard.forEach(function (input) { // eslint-disable-line
          if (input.validity.valid) {
            validFlag++;
          } else {
            validFlag--;
          }
        });
        if (validFlag === totalInputs) {
          dom.cardStatusMessage.textContent = 'Одобрен';
        } else {
          dom.cardStatusMessage.textContent = 'Не определён';
        }
      });
    });
  };

  window.order.submitForm = function () {
    var form = window.dom.formOrder;
    form.addEventListener('submit', function (evt) {
      evt.preventDefault();

      var showHideModal = function (classElement, message) {
        message = message || false;
        var modal = document.querySelector('.modal.' + classElement);
        modal.classList.remove('modal--hidden');
        if (message) {
          modal.querySelector('.modal__message').textContent = message;
        }
        modal.querySelector('button.modal__close').addEventListener('click', function () {
          modal.classList.add('modal--hidden');
        });
      };

      window.backend.save(
          function () {
            // onLoad
            form.reset();
            showHideModal('modal--success');
            // возвращаем табы по дефаулту
            window.dom.cardWrap.classList.remove('visually-hidden');
            window.dom.cashWrap.classList.add('visually-hidden');
          },
          function (message) {
            // onError
            showHideModal('modal--error', message);
          },
          new FormData(form)
      );
    });
  };
})();
