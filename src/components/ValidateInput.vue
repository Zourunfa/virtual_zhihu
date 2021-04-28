<template lang="">
 <!-- <h2>{{inputRef.val + '1'}}</h2> -->
  <div class="validate-input-container pb-3">
    <input 
    v-if="tag!='textarea'"
    class="form-control" 
    v-model="inputRef.val"
    :class = "{'is-invalid':inputRef.error}"
    @blur="validateInput"
    v-bind="$attrs"
    >
    <textarea
    v-else
    class="form-control" 
    :class = "{'is-invalid':inputRef.error}"
    @blur="validateInput"
    v-bind="$attrs"
     v-model="inputRef.val"
    >
    </textarea>
    <span v-if ="inputRef.error" class = "invalid-feedback">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  PropType,
  onMounted,
  // watch,
  computed,
} from "vue";
import { emitter } from "./ValidateForm.vue";

const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
// const passwordReg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
const rangeReg = /[\s\S]{1,20}$/;
interface RuleProp {
  type: "required" | "email" | "range" | "custom";
  message: string;
  validator?: () => boolean;
}

interface PassRule {
  type: "required" | "password" | "range" | "custom";
  message: string;
  validator?: () => boolean;
}

export type RulesProp = RuleProp[];
export type PassProp = PassRule[];
export type TagType = "input" | "textarea";

export default defineComponent({
  name: "ValidateInput",
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: "input",
    },
  },
  inheritAttrs: false, //禁用子组件继承父组件的属性
  setup(props, context) {
    // context 是 setup() 的第二个形参，它是一个上下文对象
    // ，可以通过 context 来访问Vue的实例 this
    // console.log(context.attrs);
    console.log(props.modelValue);

    const inputRef = reactive({
      val: computed({
        get: () => {
          return props.modelValue || "";
        },
        set: (val) => {
          context.emit("update:modelValue", val);
        },
      }),
      error: false,
      message: "",
    });
    console.log(inputRef.val);

    // watch(
    //   () => props.modeValue,
    //   (newValue) => {
    //     console.log("watch trrigged");
    //     inputRef.val = newValue || "";
    //   }
    // );

    // // vue3实现自定义组件的双向绑定
    // const updateValue = (e: KeyboardEvent) => {
    //   const targetValue = (e.target as HTMLInputElement).value;
    //   // console.log(targetValue);

    //   inputRef.val = targetValue;
    //   context.emit("update:modelValue", targetValue);
    // };

    const validateInput = () => {
      if (props.rules) {
        // console.log(props.rules);

        const allPassed = props.rules.every((rule) => {
          let passed = true;
          inputRef.message = rule.message;
          // console.log(rule.message);

          switch (rule.type) {
            case "required":
              passed = inputRef.val.trim() !== "";
              break;
            case "email":
              passed = emailReg.test(inputRef.val);
              break;
            case "range":
              passed = rangeReg.test(inputRef.val);
              break;
            case "custom":
              passed = rule.validator ? rule.validator() : true;
              break;
            default:
              break;
          }
          return passed;
        });
        console.log(allPassed);

        inputRef.error = !allPassed;
        return allPassed;
      }
      return true;
    };
    onMounted(() => {
      // emit可以传入任意方法
      emitter.emit("form-item-created", validateInput);
    });
    return {
      inputRef,
      validateInput,
      // updateValue,
    };
  },
});
</script>