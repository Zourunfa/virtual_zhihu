import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios'

console.log(process.env.NODE_ENV);

// import { createRouter, createWebHistory } from 'vue-router';

// import Home from './views/Home.vue';
// import Login from './views/Login.vue';
// import ColumnDetail from './views/ColumnDetail.vue';
// import { createStore } from 'vuex';

// const store = createStore({
//   state: {
//     count: 0,
//   },
//   mutations: {
//     add(state) {
//       state.count++;
//     },
//   },
// });

// store.commit('add'); //触发变化
// console.log('store', store.state.count);

// const routerHistory = createWebHistory();
// const router = createRouter({
//   history: routerHistory,
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: Home,
//     },
//     {
//       path: '/login',
//       name: 'login',
//       component: Login,
//       meta: { redirectAlreadyLogin: true },
//     },
//     {
//       path: '/column/:id',
//       name: 'column',
//       component: ColumnDetail,
//     },
//   ],
// });

// createApp(App).mount('#app')
// axios.interceptors.request.use(config=>{
//   config.params = {...config.params}
// })

// axios.get('api/columns/2').then(res=>console.log(res.data))

axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  store.commit('setError', { status: false, message: '' })
  return config
})

// 第二个回调函数处理账号密码错误登录失败的逻辑
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)

  return config
}, e => {
  console.log(e.response);
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
