<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload"
      v-bind="$attrs"
    >
      <slot name="loading" v-if="fileStatus === 'loading'">
        <button class="btn btn-primary" disabled>正在上传</button>
      </slot>
      <slot
        :uploadedData="uploadedData"
        name="uploaded"
        v-else-if="fileStatus === 'success'"
      >
        <button class="btn btn-primary" disabled>上传成功</button>
      </slot>
      <slot name="default" v-else>
        <button class="btn btn-primary">上传图片</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watch } from "vue";
import axios from "axios";
type UploadStatus = "ready" | "loading" | "success" | "error";
type CheckFunction = (file: File) => boolean;
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>,
    },
    uploaded: {
      type: Object,
    },
  },
  inheritAttrs: false,
  emits: ["file-uploaded", "file-uploaded-error"],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null);
    console.log(props);
    const fileStatus = ref<UploadStatus>(props.uploaded ? "success" : "ready");
    const uploadedData = ref(props.uploaded);
    watch(
      () => props.uploaded,
      (newValue) => {
        if (newValue) {
          fileStatus.value = "success";
          uploadedData.value = newValue;
        }
      }
    );
    const triggerUpload = () => {
      console.log(1);

      console.log(fileInput);

      if (fileInput.value) {
        fileInput.value.click();
      }
    };
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement;
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files);
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0]);
          if (!result) {
            return;
          }
        }
        fileStatus.value = "loading";
        const formData = new FormData();
        formData.append("file", files[0]);
        console.log(props.action);

        axios
          .post(props.action, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            fileStatus.value = "success";
            console.log(res);

            uploadedData.value = res.data;
            context.emit("file-uploaded", res.data);
          })
          .catch((error) => {
            console.log(error);

            fileStatus.value = "error";
            context.emit("file-uploaded-error", { error });
          })
          .finally(() => {
            if (fileInput.value) {
              fileInput.value.value = "";
            }
          });
      }
    };
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      uploadedData,
      handleFileChange,
    };
  },
});
</script>
