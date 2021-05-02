import { createStore, Commit } from 'vuex';
import axios, { AxiosRequestConfig } from 'axios'
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
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
  // data?: string
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
  columns: GlobalColumns;
  posts: PostProps[];
  user: UserProps;
}

export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}

export interface GlobalColumns {
  data: ColumnProps[];
  total: number;
}


const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {

  const res = await axios.get(url)
  commit(mutationName, res.data)
  return res.data
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const res = await axios.post(url, payload)
  commit(mutationName, res.data)
  return res.data
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }) => {
  const res = await axios(url, config)
  console.log(res.data);

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
    columns: { data: [], total: 0 },
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
      // state.columns.data = rawData.data.list
      console.log(rawData);
      const { data } = state.columns
      const { list, count } = rawData.data
      state.columns.data = data.concat(list)
      state.columns.total = count
      console.log(state.columns);

    },
    fetchColumn(state, rawData) {
      state.columns.data = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    fetchPost(state, rawData) {
      state.posts.push(rawData.data)
    },
    setLoading(state, status) {
      state.loading = status
    },
    login(state, rawData) {
      console.log(rawData);

      const { token } = rawData.data
      console.log(token);

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
    updatePost(state, { data }) {

      state.posts = state.posts.map(post => {
        // console.log(data);

        if (post._id === data._id) {
          console.log(data._id);


          return data
        } else {
          return post
        }
      })
    },
    deletePost(state, { data }) {
      // console.log(state.posts, data);
      state.posts = state.posts.filter(item => {
        return item !== data._id
      })

    }


  },

  // getters就好比store的计算属性
  getters: {
    biggerColumnsLen(state) {
      return state.columns.data.filter((c) => c._id > '2').length;
    },
    // getter可以传参
    getColumnsById: (state) => (id: string) => {
      return state.columns.data.find((c) => {
        return c._id === id
      });
    },
    getPostsById: (state) => (cid: string) => {
      return state.posts.filter((c) => {
        // console.log(c);
        return c.column === cid
      });
    },
    getCurrentPost: (state) => (id: string) => {
      // console.log(state.posts);
      let obj = {}
      // console.log(state.posts.filter(item => item._id === id));
      state.posts.forEach(item => {
        if (item._id === id) {
          obj = item
        }
      })

      return obj

    }
  },
  actions: {
    fetchColumns({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      return getAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      // const { currentPage = 1, pageSize = 5 } = params
      // if(state.columns.currentPage)
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ state, commit }, id) {
      // console.log(state.posts);

      const currentPost = state.posts.filter(item => {

        item._id === id
      })
      // console.log(currentPost);
      console.log(getAndCommit(`/api/posts/${id}`, 'fetchPost', commit));

      // if (!currentPost || !currentPost.content) {
      return getAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
      // } else {
      //   return Promise.resolve({ data: currentPost })
      // }
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
    },
    updatePost({ commit }, { id, payload }) {
      console.log(payload);

      return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, { method: 'patch', data: payload })
    },
    deletePost({ commit }, id) {
      // console.log(id);
      return asyncAndCommit(`/api/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
  }
});

export default store;
