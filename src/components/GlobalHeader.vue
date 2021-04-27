<template>
  <nav
    class="navbar navbar-light justify-content-between mb-4 px-4"
    style="background-color: #e3f2fd"
  >
    <router-link class="navbar-brand" :to="`/`">博学专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <router-link class="list-inline-item" :to="`/login`"
        ><a href="#" class="btn btn-info my-2">登陆</a></router-link
      >
      <li class="list-inline-item" href="#">
        <router-link class="list-inline-item" :to="`/signup`">
          <a href="#" class="btn btn-info my-2">注册</a></router-link
        >
      </li>
    </ul>

    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item" href="#">
        <Dropdown :title="`hello ${user.nickName}`">
          <dropdown-item
            ><router-link :to="`/create`" class="dropdown-item"
              >新建文章</router-link
            ></dropdown-item
          >
          <dropdown-item disabled
            ><a href="#" class="dropdown-item">编辑资料</a></dropdown-item
          >
          <dropdown-item
            ><button @click="logOut" class="dropdown-item">
              退出登录
            </button></dropdown-item
          >
        </Dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType } from "vue";
import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";
import { UserProps } from "../store";
import { useStore } from "vuex";
import router from "@/router";

export default defineComponent({
  components: { Dropdown, DropdownItem },
  name: "GlobalHeader",
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const logOut = () => {
      store.commit("logout");
      router.push("/login");
    };
    return {
      logOut,
    };
  },
});
</script>