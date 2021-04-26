<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">登录</h5>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Phone number</label>
        <ValidateInput
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入手机号"
          type="text"
          ref="inputRef"
        />
        {{ emailVal }}
        <div class="form-text" v-if="emailRef.error">
          {{ emailRef.message }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">密码</label>
        <ValidateInput
          type="password"
          placeholder="请输入密码"
          :rules="passwordRules"
          v-model="passwordVal"
        />
      </div>
      <template #submit>
        <span class="btn btn-danger">Submit</span>
      </template>
    </ValidateForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";

import { useRouter } from "vue-router";
import ValidateForm from "../components/ValidateForm.vue";
import ValidateInput, {
  RulesProp,
  PassProp,
} from "../components/ValidateInput.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Login",
  components: {
    ValidateInput,
    ValidateForm,
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputRef = ref<any>();
    const router = useRouter();
    const store = useStore();

    const emailVal = ref("wang");
    const passwordVal = ref("123");

    const emailRules: RulesProp = [
      { type: "required", message: "手机号不能为空" },
      { type: "email", message: "请输入正确格式的手机号" },
      { type: "range", message: "请输入5-15为字符" },
    ];
    const passwordRules: PassProp = [
      { type: "required", message: "密码不能为空" },
      { type: "password", message: "密码不符合格式" },
      { type: "range", message: "请输入5-15为字符" },
    ];

    const emailRef = reactive({
      val: "",
      error: false,
      message: "",
    });
    const onFormSubmit = (res: boolean) => {
      // console.log('result',inputRef.value.validateInput());
      // console.log('FormSubmit',res);
      // console.log(inputRef.value);
      //  router.push('/')
      // if(!res){
      //   console.log(inputRef.value);
      //   inputRef.value = ''
      // }
      if (!res) {
        router.push("/");
        store.commit("login");
      }
    };

    return {
      emailRef,

      emailRules,
      emailVal,
      passwordRules,
      onFormSubmit,
      inputRef,
      passwordVal,
      router,
    };
  },
});
</script>
