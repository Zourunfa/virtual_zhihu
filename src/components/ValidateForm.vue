<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import mitt from "mitt";
type ValidateFunc = () => boolean;
export const emitter = mitt();
export default defineComponent({
  emits: ["form-submit"],
  setup(prop, context) {
    let funcArr: ValidateFunc[] = [];

    const submitForm = () => {
      // 数组的every some方法 会提前停止循环
      const res = funcArr.map((func) => func()).every((res) => res);
      context.emit("form-submit", res);
    };
    const callback = (func: ValidateFunc | undefined) => {
      console.log(func);
      funcArr.push(func as ValidateFunc);
    };
    emitter.on("form-item-created", callback);
    onUnmounted(() => {
      emitter.off("form-item-created", callback);
      funcArr = [];
    });

    return {
      submitForm,
    };
  },
  // this在setup中是无法访问的，所以这里还是用vue2的语法
  // $on $emit 在vue3中被废除了，但是可以引用第三方库
  // mounted(){
  //   this.$on('item-created',()=>{

  //   })
  // }
});
</script>