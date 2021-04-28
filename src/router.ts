import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Signup from './views/Signup.vue'
import CreatePost from './views/CreatePost.vue';
import ColumnDetail from './views/ColumnDetail.vue';
import PostDetail from './views/PostDetail.vue'

import store from './store';
import axios from 'axios';

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
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/posts/:id',
      name: 'postDetail',
      component: PostDetail,
    }
  ],
});

// 在进入路由环境前
router.beforeEach((to, from, next) => {
  // console.log(to.meta);路由元信息
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e);
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/login')
    } else {
      next()
    }
  }
});

export default router;
