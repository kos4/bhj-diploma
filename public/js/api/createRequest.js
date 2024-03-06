/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  if (options.responseType) {
    xhr.responseType = options.responseType;
  }
  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        options.callback(null, xhr.response);
      } else {
        options.callback({
          code: xhr.status,
          message: xhr.responseText,
        }, xhr.response);
      }
    }

  });

  if (options.method === 'GET') {
    xhr.open(options.method, options.url + '?' + new URLSearchParams(options.data).toString());
    xhr.send();
  } else {
    xhr.open(options.method, options.url);
    const formData = new FormData;
    for (let property in options.data) {
      formData.append(property, options.data[property]);
    }
    xhr.send(formData);
  }
};
