'use strict';

(function () {
  var dom = {
    catalogCards: document.querySelector('.catalog__cards'),
    cartCards: document.querySelector('.goods__cards'),

    fragmentCardTemplate: document.querySelector('#card'),
    fragmentCartTemplate: document.querySelector('#card-order'),

    headerBasket: document.querySelector('.main-header__basket'),
    orderTotal: document.querySelector('.goods__total'),
    submitOrder: document.querySelector('.buy__submit-btn-wrap.container'),
  };

  dom.orderTotalContent = dom.orderTotal.querySelector('.goods__card-wrap .goods__total-count');

  dom.formOrder = document.querySelector('form[name=order]');
  dom.sectionOrder = dom.formOrder.querySelector('section.order');
  dom.cashWrap = dom.formOrder.querySelector('.payment__cash-wrap');
  dom.cardWrap = dom.formOrder.querySelector('.payment__card-wrap');
  dom.inputEmail = dom.formOrder.querySelector('input[name=email]');
  dom.inputCardNumber = dom.formOrder.querySelector('input[name=card-number]');
  dom.cardStatusMessage = dom.formOrder.querySelector('.payment__card-status');

  window.dom = dom;

})();
