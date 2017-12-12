import { LoginReg } from '../component';

const routeConfig = [
  {
    path: '/',
    // component: LoginReg,
    childRoutes: [
      { path: 'login', component: LoginReg },
    ]
  }
];

export default routeConfig;
