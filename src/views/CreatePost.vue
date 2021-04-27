<template>
  <div class="create-post-page">
    <h4 class="my-4 text-center">新建文章</h4>

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
import Uploader from "../components/Uploader.vue";
import { useRouter } from "vue-router";
import ValidateForm from "../components/ValidateForm.vue";
import ValidateInput from "../components/ValidateInput.vue";
import createMessage from "../components/createMessage";
import { beforeUploadCheck } from "../helper";
import { ResponseType } from "./Home.vue";
// import axios from "axios";
import { useStore } from "vuex";
import { ImageProps } from "../store";
import { PostProps } from "../store";

export default defineComponent({
  name: "Login",
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titleVal = ref("");
    const contentVal = ref("");
    const store = useStore();
    // const uploadedData = ref();
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

    const onFormSubmit = (res: boolean) => {
      if (res) {
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
        store.dispatch("createPost", newPost).then(() => {
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
