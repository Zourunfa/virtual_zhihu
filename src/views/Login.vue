<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">登录</h5>
    <ValidateForm @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">email</label>
        <ValidateInput
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入账户邮箱"
          type="text"
          ref="inputRef"
        />
        <!-- {{ emailVal }} -->
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
import createMessage from "../components/createMessage";

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
      { type: "required", message: "邮箱不能为空" },
      { type: "email", message: "请输入正确格式的邮箱" },
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
      console.log(1);
      console.log(res);

      if (res) {
        console.log(2);
        const payload = {
          email: emailVal.value,
          password: passwordVal.value,
        };
        store
          .dispatch("loginAndFetch", payload)
          .then(() => {
            // console.log(data);
            createMessage(`登录成功`, "success");
            router.push("/");
          })
          .catch((e) => {
            console.log(e);
          });
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
