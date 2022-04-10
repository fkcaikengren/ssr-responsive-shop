import apiConfig, { baseUrl } from '../../config/api';

const axios = require('axios');
const https = require('https');
const path = require('path');
const fs = require('fs');

// simply handle https problem
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // (NOTE: this will disable client verification)
  // cert: fs.readFileSync(path.resolve(__dirname,'../intermediate.pem')),
});

// create an instance of axios
const service = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: { 'X-Custom-Header': 'caikengren' },
  httpsAgent,
});

service.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err)
);

service.interceptors.response.use(
  (response) => {
    const { data, status, statusText } = response;
    if (status < 300 && status >= 200) {
      return data;
    }
    return Promise.reject(new Error(statusText));
  },
  (err) => Promise.reject(err)
);

export function request(apiName) {
  return service(apiConfig[apiName]);
}

export default service;
