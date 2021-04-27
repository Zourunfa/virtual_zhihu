<template>
  <div class="column-detail-page w-75 mx-auto">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          src="@/assets/lizhi.jpg"
          :alt="column.title"
          class="rounded-circle border w-100"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <PostList :list="list"></PostList>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
// import {testData,testPosts} from '../testData'
import PostList from "../components/PostList.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Home",
  components: {
    PostList,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const currentId = route.params.id; //将string转化成number 用一个小加号
    onMounted(() => {
      store.dispatch("fetchColumn", currentId);
      store.dispatch("fetchPosts", currentId);
    });
    //  find方法找到满足条件的第一元素
    // filter方法找到满足条件的所有元素
    const defaultUrl = "@/assets/lizhi.jpg";
    const column = computed(() => {
      const res = store.getters.getColumnsById(currentId);

      // res.avatar.fitUrl = "@/assets/lizhi.jpg";
      return res;
    });
    // if (!column.value.avatar) {
    //   column.value.avatar = {
    //     url: require("@/assets/lizhi.jpg"),
    //   };
    // }
    // console.log(store.getters.getColumnsById(currentId).avatar);

    const list = computed(() => store.getters.getPostsById(currentId));
    // console.log(list);

    // console.log(list);

    return {
      route,
      column,
      list,
      defaultUrl,
    };
  },
});
</script>
