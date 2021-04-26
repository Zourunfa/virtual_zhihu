import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios'
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
  return config
})

axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
})

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');
