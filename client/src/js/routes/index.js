import { LoginReg, ChatRoom, Root, UserDetail } from '../component';
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
      { path: 'user-info', component: UserDetail },
      { path: 'chat', component: ChatRoom, childRoutes: [
        {path: '/chat/:id', component: ChatRoom},
      ]},
    ]
  }
];

export default routeConfig;
