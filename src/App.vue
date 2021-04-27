<template>
  <div class="container">
    <GlobalHeader :user="currentUser" />
    <!-- <ColumnList :list="list"/> -->
    <!-- <ValidateForm @form-submit="onFormSubmit">
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Phone number</label>
    <ValidateInput 
    :rules="emailRules" 
    v-model='emailVal'
    placeholder="请输入手机号"
    type="text"
    ref="inputRef"
    />
    {{emailVal}}
    <div class="form-text" v-if="emailRef.error">{{emailRef.message}}</div>
    
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
  </div> -->
    <!-- <h1 style="color: red">{{ error.message }}</h1> -->
    <loader v-if="isLoading" text="拼命加载..."></loader>
    <!-- <message
      type="error"
      :message="error.message"
      v-if="error.status"
    ></message> -->
    <!-- <router-view to="/login"></router-view> -->
    <router-view to="/signup"></router-view>

    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">@博学专栏</li>
          <li class="list-inline-item">天文</li>
          <li class="list-inline-item">地理</li>
          <li class="list-inline-item">外事</li>
          <li class="list-inline-item">房事</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalHeader from "./components/GlobalHeader.vue";
// import store from './store'
import { useStore } from "vuex";
import Loader from "./components/Loader.vue";
// import Message from "./components/Message.vue";
import createMessage from "./components/createMessage";

export default defineComponent({
  name: "App",
  components: {
    GlobalHeader,
    Loader,
    // Message,
  },
  setup() {
    // const currentUser = store.state.user
    const store = useStore();
    const currentUser = computed(() => store.state.user);
    const isLoading = computed(() => {
      return store.state.loading;
    });
    const error = computed(() => store.state.error);
    // console.log(error);
    // console.log(Message);
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value;
        if (status && message) {
          createMessage(message, "error");
        }
      }
    );

    return {
      currentUser,
      isLoading,
      error,
    };
  },
});
</script>

<style lang="sass">
</style>
