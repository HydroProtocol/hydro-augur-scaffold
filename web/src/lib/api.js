import axios from 'axios';
import env from './env';
import { store } from '../index';
import { cleanLoginDate, loadAccountHydroAuthentication } from './session';

const getAxiosInstance = () => {
  const state = store.getState();
  const address = state.account.get('address');
  const jwt = loadAccountHydroAuthentication(address);
  let instance;

  if (jwt) {
    instance = axios.create({
      headers: {
        'Hydro-Authentication': jwt
      }
    });
  } else {
    instance = axios;
  }

  instance.interceptors.response.use(function(response) {
    if (response.data && response.data.status === -11) {
      const address = state.account.get('address');
      if (address) {
        cleanLoginDate(address);
      }
    }
    return response;
  });

  return instance;
};

const _request = (method, url, ...args) => {
  return getAxiosInstance()[method](`${env.API_ADDRESS}${url}`, ...args);
};

const api = {
  get: (url, ...args) => _request('get', url, ...args),
  delete: (url, ...args) => _request('delete', url, ...args),
  head: (url, ...args) => _request('head', url, ...args),
  post: (url, ...args) => _request('post', url, ...args),
  put: (url, ...args) => _request('put', url, ...args),
  patch: (url, ...args) => _request('patch', url, ...args)
};

export default api;
