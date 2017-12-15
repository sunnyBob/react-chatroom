import axios from 'axios';
require("babel-core/register");
require("babel-polyfill");

export default function(options) {
  axios.defaults.timeout = 5000;
  axios.defaults.baseURL = '/api/'

  const config = {
    method: options.method || 'GET',
    url: options.url || '',
    responseType: 'json',
  };

  if (options.method && options.method.toLowerCase() === 'get') {
    config.data = options.data;
  } else {
    config.params = options.data;
  }

  axios.interceptors.response.use(
    response => {
      const resp = response && response.data || {};
      if (resp.code === 2000) {
        window.location.href = '/logout'
      }
      return resp;
    }, Promise.reject
  );
  
  return axios.request(config);
}
