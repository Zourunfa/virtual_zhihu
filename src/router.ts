import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import CreatePost from './views/CreatePost.vue';
import ColumnDetail from './views/ColumnDetail.vue';

import store from './store';

const routerHistory = createWebHistory();
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true },
    },
    {
      // 动态路由
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail,
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: {
        requiredLogin: true,
      },
    },
  ],
});

// 在进入路由环境前
router.beforeEach((to, from, next) => {
  // console.log(to.meta);路由元信息

  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next('/login');
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/');
  } else {
    next();
  }
});

export default router;
