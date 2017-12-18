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

  if (config.method.toLowerCase() === 'get') {
    config.params = options.data;
  } else {
    config.data = options.data;
  }

  axios.interceptors.response.use(
    response => {
      const resp = response && response.data || {};
      if (resp.code === '2000') {
        window.location.href = '/login'
      }
      if (resp.code === '5000') {
        alert(resp.message);
      }
      return resp;
    }, Promise.reject
  );
  
  return axios.request(config);
}
