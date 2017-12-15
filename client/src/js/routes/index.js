import { LoginReg, ChatRoom } from '../component';

const routeConfig = [
  {
    path: '/',
    indexRoute: { onEnter: (nextState, replace) => replace('/chat') },
    childRoutes: [
      { path: 'login', component: LoginReg },
      { path: 'chat', component: ChatRoom },
    ]
  }
];

export default routeConfig;
