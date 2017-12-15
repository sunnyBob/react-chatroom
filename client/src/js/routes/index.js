import { LoginReg, ChatRoom } from '../component';

const routeConfig = [
  {
    path: '/',
    indexRoute: { onEnter: ({params}, replace) => replace('/chat') },
    childRoutes: [
      { path: 'login', component: LoginReg },
      { path: 'chat', component: ChatRoom },
    ]
  }
];

export default routeConfig;
