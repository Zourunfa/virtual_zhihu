<template>
  <div class="create-post-page">
    <!-- {{ isEditMode + "12214" }} -->
    <h4 class="my-4 text-center">{{ isEditMode ? "编辑文章" : "新建文章" }}</h4>
    <!-- {{ titleVal }} -->
    <!-- <input type="file" name="file" @change.prevent="handleFileChange" /> -->
    <Uploader
      action="/api/upload"
      :beforeUpload="uploadCheck"
      @file-uploaded="handleFileUploaded"
      :uploaded="uploadedData"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only"></span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploaded-area">
          <img :src="dataProps.uploadedData.data.url" />
          <h3>点击重新上传</h3>
        </div>
      </template>
    </Uploader>

    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <ValidateInput
          placeholder="请输入文章标题"
          type="text"
          v-model="titleVal"
        />
      </div>
      {{ titleVal }}
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
        <span class="btn btn-danger">{{
          isEditMode ? "更新文章" : "发表文章"
        }}</span>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Uploader from "../components/Uploader.vue";
import { useRouter, useRoute } from "vue-router";
import ValidateForm from "../components/ValidateForm.vue";
import ValidateInput from "../components/ValidateInput.vue";
import createMessage from "../components/createMessage";
import { beforeUploadCheck } from "../helper";
import { ResponseType } from "./Home.vue";
// import {}
// import axios from "axios";
import { useStore } from "vuex";
import { ImageProps } from "../store";
import { PostProps } from "../store";

export interface UploadType {
  data?: string | ImageProps | undefined;
}

export default defineComponent({
  name: "Login",
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadedData = ref();

    const titleVal = ref("");
    const contentVal = ref("");
    const store = useStore();
    const route = useRoute();
    const isEditMode = !!route.query.id;
    // const uploadedData = ref();
    onMounted(() => {
      if (isEditMode) {
        store
          .dispatch("fetchPost", route.query.id)
          .then((rawData: ResponseType<PostProps>) => {
            const currentPost = rawData.data;
            // console.log(currentPost.image);

            if (currentPost.image) {
              // uploadedData = currentPost.image as Ref<any>;
              // uploadedData = "sadsad";
              uploadedData.value = { data: currentPost.image };
            }
            // console.log(uploadedData);
            // console.log(currentPost.title);

            titleVal.value = currentPost.title;
            contentVal.value = currentPost.content || "";
          });
      }
    });
    // console.log(uploadedData.value);
    const router = useRouter();
    let imageId = "";
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ["image/jpeg", "image/png"],
        size: 1,
      });
      const { passed, error } = result;
      if (error === "format") {
        createMessage("上传图片只能是 JPG/PNG 格式!", "error");
      }
      if (error === "size") {
        createMessage("上传图片大小不能超过 1Mb", "error");
      }
      return passed;
    };
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id;
      }
    };
    // console.log(titleVal.value);

    const onFormSubmit = (res: boolean) => {
      if (res) {
        console.log(titleVal.value);

        const { column, _id } = store.state.user;
        const newPost: PostProps = {
          // _id: new Date().getTime(),
          title: titleVal.value,
          content: contentVal.value,
          column,
          author: _id,
        };
        if (imageId) {
          newPost.image = imageId;
        }
        const actionName = isEditMode ? "updatePost" : "createPost";
        const sendData = isEditMode
          ? { id: route.query.id, payload: newPost }
          : newPost;
        store.dispatch(actionName, sendData).then(() => {
          createMessage("发表成功", "success");
        });
        router.push(`/column/${column}`);
      }
    };

    return {
      onFormSubmit,
      // inputRef,
      router,
      titleVal,
      contentVal,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      isEditMode,
    };
  },
});
</script>
<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
