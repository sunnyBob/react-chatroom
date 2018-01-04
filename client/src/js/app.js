import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routeConfig from './routes';
import RootStore from './stores/rootStore';
import { Provider } from 'mobx-react';

render(
  <Provider RootStore={RootStore}>
    <Router routes={routeConfig} history={browserHistory}/>
  </Provider>,
  document.getElementById('app')
);
