<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>{{ post.title + post._id }}</h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <img
              :src="post.image.url"
              :alt="post.title"
              class="rounded-lg w-100"
            />
          </div>
          <p :class="{ 'col-8': post.image }" class="newStyle">
            {{ post.excerpt && post.excerpt.substr(0, 50) + "......." }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from "vue";
import { PostProps } from "../store";

export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>,
    },
  },
  setup(props) {
    console.log(props);
  },
});
</script>

<style scope>
.newStyle {
  overflow: hidden;
}
</style>