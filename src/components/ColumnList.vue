<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-3 mt-2">
      <div class="card shawow-sm">
        <div class="card-body text-center">
          <img
            id="img"
            :src="column.avatar && column.avatar.url"
            class="rounded-circle border border-light my-3"
            :alt="column.title"
          />
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-left">
            {{ column.description }}
          </p>
          <router-link
            :to="`/column/${column._id}`"
            class="btn btn-outline-primary"
            >进入专栏</router-link
          >
          <!-- <router-link :to="{name:'column',params:{id:column.id}}" class="btn btn-outline-primary">进入专栏</router-link> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnProps } from "../store";
// export interface ColumnProps {
//   id: number;
//   title: string;
//   avator?: string;
//   description: string;
// }

export default defineComponent({
  name: "ColumnList",
  props: {
    list: {
      //下面写成 Array as ColumnProps是不行的
      // 因为Array是数组的构造函数肯定不能将它断言为类型的
      // 所以vue封装了一个函数PropType,接收一个泛型，返回泛型所传入的类型
      type: Array as PropType<ColumnProps[]>,
      required: true,
    },
  },
  setup(props) {
    // onMounted(()=>{
    //    const a = require('@/assets/lizhi.jpg')
    //       console.log(a);
    // })

    const columnList = computed(() => {
      return props.list.map((column) => {
        // console.log(column.avator.url);
        // 如果这个的avator属性不存在，就给他设置下面李志的图片
        if (!column.avatar) {
          column.avatar = {
            url: require("@/assets/lizhi.jpg"),
          };
        }
        return column;
      });
    });

    console.log(columnList);

    return {
      columnList,
    };
  },
});
</script>


<style  scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
</style>
