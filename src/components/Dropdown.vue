/* eslint-disable @typescript-eslint/no-unused-vars */
<template>
  <div class="dropdown" ref="dropRef">
    <a
      href="#"
      class="btn btn-outline-light my-2 dropdown-toggle"
      @click="toggleOpen"
      >{{ title }}</a
    >
    <ul class="dropdown-menu" style="display: block" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import useClickOutside from "../hooks/useClickOutside";
export default defineComponent({
  name: "Dropdown",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false);
    const dropRef = ref<null | HTMLElement>(null);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };
    const isClickOutside = useClickOutside(dropRef);

    watch(isClickOutside, () => {
      if (isOpen.value && !isClickOutside.value) {
        console.log("watch");

        isOpen.value = false;
      }
    });

    // const handler = (e: MouseEvent) =>{
    //     if(dropRef.value){
    //         console.log(dropRef.value);
    //         console.log(isOpen.value);
    //         console.log(e.target);

    //         if(!dropRef.value.contains(e.target as HTMLElement)&& isOpen.value){
    //             isOpen.value = false
    //         }
    //     }
    // }
    // onMounted(()=>{
    //     document.addEventListener('click',handler)
    // })
    // onUnmounted(()=>{
    //     document.removeEventListener('click',handler)
    // })

    return {
      isOpen,
      toggleOpen,
      dropRef,
    };
  },
});
</script>