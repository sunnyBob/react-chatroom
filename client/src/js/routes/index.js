import { LoginReg, ChatRoom, Root, UserDetail, Invitation } from '../component';
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
      { path: '/user-info/:id', component: UserDetail },
      { path: 'chat', component: ChatRoom, childRoutes: [
        {path: '/chat/:id', component: ChatRoom},
      ]},
      { path: 'invitation', component: Invitation },
    ]
  }
];

export default routeConfig;
