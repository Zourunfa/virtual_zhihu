import { createStore, Commit } from 'vuex';
import axios from 'axios'
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column: string;
  email: string;
}

// export interface PostProps {
//   _id?: string;
//   title: string;
//   excerpt?: string;
//   content?: string;
//   image?: ImageProps | string;
//   createdAt?: string;
//   column: string;
//   author?: string
// }
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}


export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}


const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {

  const res = await axios.get(url)
  commit(mutationName, res.data)
  return res.data
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const res = await axios.post(url, payload)
  // console.log(res);

  commit(mutationName, res.data)
  return res.data
}


const store = createStore<GlobalDataProps>({
  state: {
    error: {
      status: false
    },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false, email: '', column: '' },
  },
  mutations: {
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, name: 'sattre' };
    // },
    createPost(state, newPost) {
      state.posts.push(newPost);
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading(state, status) {
      state.loading = status
    },
    login(state, rawData) {
      const { token } = rawData.data
      state.token = token
      // 用localStorage在本地存储token
      localStorage.setItem('token', token)

      // 为以后的每次请求头带上token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    logout(state) {
      state.token = ''
      state.user = { isLogin: false, email: '', column: '' },
        localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },

  },
  // getters就好比store的计算属性
  getters: {
    biggerColumnsLen(state) {
      return state.columns.filter((c) => c._id > '2').length;
    },
    // getter可以传参
    getColumnsById: (state) => (id: string) => {
      return state.columns.find((c) => {
        return c._id === id
      });
    },
    getPostsById: (state) => (cid: string) => {
      return state.posts.filter((c) => {
        // console.log(c);
        return c.column === cid
      });
    },
  },
  actions: {
    fetchColumns({ commit }) {
      return getAndCommit('/api/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    login({ commit }, payload) {
      return postAndCommit(`/api/user/login`, 'login', commit, payload)
    },
    fetchCurrentUser({ commit }) {
      getAndCommit(`/api/user/current`, 'fetchCurrentUser', commit)
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    createPost({ commit }, payload) {
      return postAndCommit('/api/posts', 'createPost', commit, payload)
    }
  }
});

export default store;
