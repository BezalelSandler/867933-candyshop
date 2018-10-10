'use strict';

(function () {
  window.backend = {};
  var url = {
    load: 'https://js.dump.academy/candyshop/data',
    upload: 'https://js.dump.academy/candyshop'
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
      xhr.open('POST', url.upload);
    } else {
      xhr.open('GET', url.load);
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
