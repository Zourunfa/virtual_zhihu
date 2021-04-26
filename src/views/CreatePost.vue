<template>
  <div class="create-post-page">
    <h4 class="my-4 text-center">新建文章</h4>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <ValidateInput
          placeholder="请输入文章标题"
          type="text"
          v-model="titleVal"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <ValidateInput
          rows="15"
          type="text"
          tag="textarea"
          v-model="contentVal"
          placeholder="请输入文章内容"
        />
      </div>
      <template #submit>
        <span class="btn btn-danger">发表文章</span>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { useRouter } from "vue-router";
import ValidateForm from "../components/ValidateForm.vue";
import ValidateInput from "../components/ValidateInput.vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "../store";
import { PostProps } from "../testData";

export default defineComponent({
  name: "Login",
  components: {
    ValidateInput,
    ValidateForm,
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titleVal = ref("");
    const contentVal = ref("");
    const router = useRouter();
    const store = useStore<GlobalDataProps>();

    const onFormSubmit = (res: boolean) => {
      if (res) {
        const { columnId } = store.state.user;

        const newPost: PostProps = {
          id: new Date().getTime(),
          title: titleVal.value,
          content: contentVal.value,
          columnId,
          createdAt: new Date().toString(),
        };
        console.log(newPost);

        store.commit("createPost", newPost);
        router.push(`/column/${1}`);
      }
    };

    return {
      onFormSubmit,
      // inputRef,
      router,
      titleVal,
      contentVal,
    };
  },
});
</script>
