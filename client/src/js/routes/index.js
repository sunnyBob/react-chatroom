import { LoginReg, ChatRoom } from '../component';
import Root from '../root/root';

const routeConfig = [
  {
    path: '/login',
    component: LoginReg,
  },
  {
    path: '/',
    component: Root,
    indexRoute: { onEnter: (nextState, replace) => replace('/chat') },
    childRoutes: [
      { path: 'login', component: LoginReg },
      { path: 'chat', component: ChatRoom },
    ]
  }
];

export default routeConfig;
