<template>
  <div class="home-page">
    <!-- <h2>{{bigLen}}</h2> -->
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <!-- <img src="../assets/callout.svg" alt="callout" class="w-50"/> -->
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create">
              <a href="#" class="btn btn-primary my-2">开始写文章</a>
            </router-link>
          </p>
        </div>
      </div>
    </section>

    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
    <div class="d-grid gap-2 col-6 mx-auto">
      <!-- <button
        class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25"
        @click="loadMorePage"
        v-if="!isLastPage"
      >
        加载更多
      </button> -->
    </div>
  </div>
</template>

<script lang="ts">
// import ColumnList from '@/components/ColumnList.vue'
import { defineComponent, computed, onMounted } from "vue";
// import { defineComponent, computed, onMounted } from 'vue'
// import { useStore } from 'vuex'
// import { GlobalDataProps } from '../store'
// import useLoadMore from '../hooks/useLoadMore'
import ColumnList from "../components/ColumnList.vue";

import { useStore } from "vuex";
import { GlobalDataProps, ImageProps } from "../store";
import createMessage from "@/components/createMessage";
export interface ResponseType<p = {}> {
  code: number;
  msg: string;
  data: p;
}

export default defineComponent({
  name: "Home",
  components: {
    ColumnList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();

    const bigLen = computed(() => store.getters.biggerColumnsLen);
    // console.log(bigLen);

    onMounted(() => {
      store.dispatch("fetchColumns");
    });
    const list = computed(() => store.state.columns);
    // console.log(list);
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      createMessage(`上传图片ID ${rawData.data._id}`, "success");
    };

    return {
      list,
      bigLen,
      onFileUploaded,
      //     loadMorePage,
      //     isLastPage
    };
  },
});
</script>
