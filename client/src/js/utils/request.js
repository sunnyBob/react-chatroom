import axios from 'axios';
require("babel-core/register");
require("babel-polyfill");

export default function(options) {
  axios.defaults.timeout = 100000;
  axios.defaults.baseURL = '/api'

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
      if (response.data) {
        const resp = response.data;
        if (resp.code === '2000') {
          window.location.href = '/login'
        }
        if (resp.code === '5000') {
          alert(resp.message);
        }
      }
      return response.data || response;
    }, error => Promise.reject(error)
  );
  return axios.request(config);
}
