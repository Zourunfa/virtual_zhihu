import { createStore, Commit } from 'vuex';
import axios from 'axios'
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId: number;
}

export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface GlobalDataProps {
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}

interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {

  const res = await axios.get(url)
  commit(mutationName, res.data)

}


const store = createStore<GlobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: true, columnId: 1, name: 'sattre' },
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'sattre' };
    },
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
    }
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
      getAndCommit('/api/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}/posts`, 'fetchPosts', commit)
    }
  }
});

export default store;
