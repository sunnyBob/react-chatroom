import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routeConfig from './routes';
import rootStore from './stores/rootStore';
import { Provider } from 'mobx-react';

render(
  <Provider rootStore={rootStore}>
    <Router routes={routeConfig} history={browserHistory}/>
  </Provider>,
  document.getElementById('app')
);
