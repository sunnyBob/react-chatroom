import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routeConfig from './routes';
import RootStore from './stores/rootStore';
import { Provider } from 'mobx-react';
import { ToastContainer } from 'react-toastify';

window.socket = io.connect('https://192.168.1.115:3000');
window.toastOption = {
  autoClose: 2000,
  closeButton: false,
};
render(
  <Provider RootStore={RootStore}>
    <Router routes={routeConfig} history={browserHistory}/>
  </Provider>,
  document.getElementById('app')
);
