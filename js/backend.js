'use strict';

(function () {
  window.backend = {};
  var URL = {
    LOAD: 'https://js.dump.academy/candyshop/data',
    UPLOAD: 'https://js.dump.academy/candyshop'
  };
  var sendRequest = function (onLoad, onError, data) {
    data = data || false;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка ' + xhr.status + ' - ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000;
    if (data) {
      xhr.open('POST', URL.UPLOAD);
    } else {
      xhr.open('GET', URL.LOAD);
    }
    xhr.send(data ? data : '');
  };

  window.backend.load = function (onLoad, onError) {
    sendRequest(onLoad, onError);
  };

  window.backend.save = function (onLoad, onError, data) {
    sendRequest(onLoad, onError, data);
  };
})();
