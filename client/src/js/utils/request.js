import axios from 'axios';
require("babel-core/register");
require("babel-polyfill");

export default async function(options) {
  const config = {
    baseURL: 'http://127.0.0.1:3000/api/',
    method: options.method || 'GET',
    url: options.url || '',
    timeout: 2000,
    responseType: 'json',
  };
  if (options.method && options.method.toLowerCase() === 'get') {
    config.data = options.data;
  } else {
    config.params = options.data;
  }
  return await axios.request(config);
}
