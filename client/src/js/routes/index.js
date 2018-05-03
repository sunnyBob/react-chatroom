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
      { path: '/user-info/:id', component: UserDetail },
      { path: 'chat', component: ChatRoom, childRoutes: [
        {path: '/chat/:id', component: ChatRoom},
      ]},
      { path: 'invitations', component: Invitation },
      { path: '/group', component: ChatRoom, childRoutes: [
        { path: '/group-chat/:id', component: ChatRoom },
      ]},
    ]
  }
];

export default routeConfig;
