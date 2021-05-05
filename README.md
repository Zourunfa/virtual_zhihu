



## Dropdown组件

- 下拉的每个item都可以拥有自己的属性和逻辑特点-用slot
- 下拉菜单点击其他区域下拉菜单的收起功能

**第一个用到自定义hook的地方：Dropdown组件点击外部区域自动隐藏**

```js
import { ref, onMounted, onUnmounted, Ref } from 'vue'

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
  const isClickOutside = ref(false)
  const handler = (e: MouseEvent) => {
    if (elementRef.value) {
      if (elementRef.value.contains(e.target as HTMLElement)) {
        isClickOutside.value = false
      } else {
        isClickOutside.value = true
      }
    }
  }
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
  return isClickOutside
}

export default useClickOutside
```



### 下拉的每个item都可以拥有自己的属性和逻辑特点-用slot

GlobalHeader.vue

```vue
<ul v-else class="list-inline mb-0">
      <li class="list-inline-item" href="#">
        <Dropdown :title="`hello ${user.name}`">
          <dropdown-item
            ><router-link :to="`/create`" class="dropdown-item"
              >新建文章</router-link
            ></dropdown-item
          >
          <dropdown-item disabled
            ><a href="#" class="dropdown-item">编辑资料</a></dropdown-item
          >
          <dropdown-item
            ><a href="#" class="dropdown-item">退出登录</a></dropdown-item
          >
        </Dropdown>
      </li>
    </ul>
```

Dropdown.vue

```vue
<ul class="dropdown-menu" style="display: block" v-if="isOpen">
      <slot></slot>
    </ul>
```



DropdownItem.vue

```vue
<li class="dropdown-option" :class="{'is-disabled': disabled}">
    <slot></slot>
</li>
```



### 下拉菜单点击其他区域下拉菜单的收起功能

![image-20210425095345760](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210425095345760.png)

这里可以用自定义hook函数，函数传入参数是一个dom节点，监听document中的点击事件，看点击的区域是否在这个节点内部

**下面用到了vue3的watch监听isClickOutSide的变化,否则它就只会执行一次**

```js
import { ref, onMounted, onUnmounted,Ref } from "vue";

const useClickOutside = (elementRef: Ref<null | HTMLElement>) => {
    const isClickOutside = ref(false)
    const handler = (e: MouseEvent) => {
        if (elementRef.value) {
            if (!elementRef.value.contains(e.target as HTMLElement)) {
                isClickOutside.value = false
            }else{
                isClickOutside.value = true
            }
        }
    }
    onMounted(() => {
        // console.log(123132132);
        
        document.addEventListener('click', handler)
        // console.log(isClickOutside.value);
        
    })
    onUnmounted(() => {
        document.removeEventListener('click', handler)
    })
    return isClickOutside
}

export default useClickOutside
```

```js
    const isClickOutside = useClickOutside(dropRef);

    watch(isClickOutside, () => {
      // console.log(isClickOutside.value);

      if (isOpen.value && !isClickOutside.value) {
        console.log("watch");

        isOpen.value = false;
      }
    });

```



## 父子通信



注意：$on $emit 在vue3中被废除了，**但是可以引用第三方库**mitt

![image-20210425151904818](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210425151904818.png)

![image-20210425152924000](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210425152924000.png)

## vue-route

- this.$route - 获取路由的信息
- this.$router - 定义路由的一些列行为



### 路由元信息

![image-20210426154843505](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426154843505.png)

## Restful API

endpoints

![image-20210425170625621](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210425170625621.png)

url中一般只有名词，没有动词，且名词与数据库的表名对应

![image-20210425170739371](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210425170739371.png)



## login和register组件的表单

> 因为组件是自己写的，所以我觉得登录和注册的时候的表单验证还是有挺多细节的，先是一个大的login组件中有一个form组件，其中form组件又有多个input组件，一旦点击某个Input组件时，就会触发@blur（焦点事件）事件，然后此焦点事件函数会对这个输入框的每个验证规则进行验证，一个输入框是有多个验证规则的，比如这些验证规则（对象数组）是对输入的长度大小等格式验证。此事件函数返回一个Bool值，然后将此事件传给父组件form，父组件定义一个函数数组接收触发每一个input组件的后的验证规则函数的返回值，然后再点击submit按钮的时候，只要一个不满足(every,swtich)会返回false，把结果返回给login组件。根据此结果判断是否需要发送异步登录请求



## token权限管理

> 登录的身份象征，登录后的其他用户信息需要借助此令牌获取

基于cookie和Session的身份验证

![image-20210426121335448](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426121335448.png)



> 浏览器向服务器提交post请求登录，服务器验证登录账号密码，如果是对的就会创建对应的session数据并且保存，一般保存在数据库中可以用redis缓存，然后服务器发回一个response,有一个set-cookie属性，会把唯一的sessionid带上去，浏览器端会把cookie保存状态，然后此用户接下来的请求会携带此cookie证明自己的身份，拿数据

扩展性不好，如果搭建的是服务器集群，会要求session共享，可以持久化



**基于token的身份验证**

![image-20210426122119291](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426122119291.png)

> 浏览器用户登录成功之后，服务器会使用JWT算法生成对应的token返回给浏览器,浏览器会把这个token存储在客户端，最常见的是存储在localStorage，或者SessionStorage中，之后发请求会带上token,JWT反向验证，此种方法没有状态，不需要记录用户的状态就可以验证身份，可扩展



用localStorage**持久化用戶的状态**

![image-20210426151210053](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426151210053.png)

**权限管理**

**先在store的action中分别注册两个函数，一个是(login)登录的action可以传入登录的账号密码然后post到后端登录接口验证，然后另一个action对应获取当前用户信息接口的异步请求，然后将这两个action组合起来形成组合action，所以这个组合action就是dispatch('login')的后面.then回调再dispatch获取当前用户的信息,**

![image-20210426213728256](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426213728256.png)

**在**login的action中，调用post接口会获取到一个tocken值,commit提交相应的login的mutation中会将这个mutation存储到state的token中，并且还会用localstorage的getItem方法持久化存在本地，而且设置axios.defaults.headers.common.Authorization = `Bearer ${token}`

为以后的每次请求头带上token

并且在当前用户currentUser  mutation中设置state中用户的状态

对应的logout登出mutation会将本地的token值都移除



![image-20210426213755161](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426213755161.png)

![image-20210426214010782](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426214010782.png)

![image-20210426214536542](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426214536542.png)

之后在前置路由beforEach中，判断用户的状态和token值，只要有这个token值在本地存储中没被移除，说明用户是登录过的，然后就dispatch(currentUser)这个action。改变用户的状态

![image-20210426214548234](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210426214548234.png)



其实这个localStorage还是有点缺陷的就是，会永久存储，除非清楚缓存。可以让localStorage想cookie一样有时间，重写get，set方法

**删除和编辑文章的权限**

> 当一篇文章的作者是当前登录用户的时候他就应该有操作这篇文章的权限，获取单独文章的数据结构中有一个author对象中的id指代为一个作者，当前用户接口也同样有一个独一无二的id 如果这两个id相同那么说明有操作权限





## 文件上传-组件



> 新建文章的时候有一个上传组件稍微麻烦的地方就是上传组件设置有三个状态，分别是上传前，上传中，和上传完成后。所以要设置一个响应式的值，表示这三种状态，点击上传时，调用函数，改变状态值，根据不同的阶段展示不同的元素，用具名插槽完成不同自定义模板的需求，这里并且不同状态下会有不同的逻辑处理函数，比如上传前，需要检查上传文件的格式，看是否符合要求，上传成功后在异步请求的promise的.then方法后触发上传成功的事件。.catch触发上传失败的事件，分别在这些事件中弹出提示框



![image-20210427103956044](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210427103956044.png)



![image-20210427104001904](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210427104001904.png)



子组件的slot赋值name，父组件用v-slot:name和子组件的插槽一一对应

![image-20210503142025874](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210503142025874.png)



![image-20210503142104469](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210503142104469.png)

为了使上传完成后，将上传成功的文件展示出来，需要从子组件slot中拿到值传给父组件。所以这时候又用到了作用域插槽，子组件直接动态绑定想要传过去的值，父组件直接用v-slot拿到值



![image-20210503142857778](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210503142857778.png)



文件上传的原理**

form提交的方式：当文件选择完毕之后有两种方式选择提交文件

第一种是传统的方式：form-submission

![image-20210427104831267](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210427104831267.png)







第二种使用js发送异步请求的方式：此种方式会有更好的体验，能够显示提交进度

```js
<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload"
      v-bind="$attrs"
    >
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot
        v-else-if="fileStatus === 'success'"
        name="uploaded"
        :uploadedData="uploadedData"
      >
        <button class="btn btn-primary">上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
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
  emits: ["file-uploaded", "file-uploaded-error"],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null);
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
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const handleFileChange = (e: Event)=>{
      const currentTarget =  e.target as HTMLInputElement
      if(currentTarget.files){
        const files = Array.from(currentTarget.files)
        if(props.beforeUpload){
          const res = props.beforeUpload(files[0])
          if(!res){
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file',files[0])
        axios.post(props.action,formData,{
          headers:{
            'Content-Type': 'multipart/form-data'
          }
        }).then(res=>{
          fileStatus.value ='success'
          uploadedData.value = res.data
          context.emit('file-uploaded',res.data)
        }).catch(error=>{
          fileStatus.value = 'error'
          context.emit('file-uploaded-error',{error})
        }).finally(()=>{
          if(fileInput.value){
            fileInput.value.value = ''
          }
        })
      }
    }

    return {
      triggerUpload,
      handleFileChange
    };
  },
});
</script>

```



## 编辑文章功能

权限问题：一个用户只能编辑和删除自己的文章，当这篇文章的作者是当前用户时，则说明是有权限的，比较两个当前用户和当前文章数据结构的id字段。



编辑文章页面和新建文章界面的区别是多个编辑的按钮和将就文章的内容也展示出来好修改。发送的请求类型也不一样，一个是post一个patch更新数据，在展示文章的组件的编辑按钮中的router-link添加一个query,点击编辑按钮后进入编辑文章页面的时候，用route对象拿到这个query。然后根据这个query发送patch异步请求拿到数据填充文章页面的表单，当从父组件createPost页面发送异步请求后，判断是否上传的一个bool值传给uploader子组件时，这个值是undefined，因为vue3的组件生命周期setup函数的逻辑只执行了一次，而这个bool值是异步请求成功后再改变的，所以要用watch动态监听这个值，



![image-20210503144758216](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210503144758216.png)



自定义v-model

![image-20210503153239903](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210503153239903.png)

当异步请求到文章标题和文章内容后并赋值后也没有立即显示在编辑页面的 表单中，也可以watch监听input的value并换成newValue，但是用watch监听之后，以前的updataValue函数（自定义v-model必须动态绑定值加一个跟新时触发的事件）也会重新执行，所以两个是重复操作，为了去除这个重复操作，将input.val设置为computed计算属性，用了computed的set方法，在它的值改变的时候发送update:modelValue，然后在父组件v-model绑定值。以前的watch和updateValue函数都可以被替代了。之后点击更新发送异步请求就可以跟新 了

![image-20210503155321962](C:\Users\47302\AppData\Roaming\Typora\typora-user-images\image-20210503155321962.png)





## vue3父子组件自定义v-model

在父组件设置modelValue变量 放在 v-model中
则在子组件的props属性 会有一个modelValue属性 ，可看下面的子组件console出来的propsS
也就是你会发现子组件的proos.modelValue的值 会是父组件 v-model的值
第二步 在子组件中emit context.emit(‘update:modelValue’, targetValue)

```js
  <data-m  v-model="modelValue"></data-m>
  {{modelValue}}
	
import DataM from './components/DataM.vue'
export default {
  components: { Model, DataM },
   setup(){
   const modelValue = ref('wk')
   return{modelValue}
  }
}

```

// DataM.vue 组件

```vue
<template>
    <div class="validate-input-container pb-3">
        <input type='text' :value="val" @input="updateValue">
  </div>
</template>
<script lang="ts">
import {defineComponent, ref} from 'vue'
export default defineComponent({
    props: {modelValue: String},
    setup(props, context){
        console.log(props); //观察改值 
        const val = ref(props.modelValue)
        const updateValue = (e: KeyboardEvent) => {
            const targetValue = (e.target as HTMLInputElement).value
            val.value = targetValue
            context.emit('update:modelValue', targetValue)
        }
        return {
            val,
            updateValue
        }
    }
})S
</script>
```



<template>
    <div class="validate-input-container pb-3">
        <input type='text' :value="val" @input="updateValue">
  </div>
</template>
<script lang="ts">
import {defineComponent, ref} from 'vue'
export default defineComponent({
    props: {modelValue: String},
    setup(props, context){
        console.log(props); //观察改值 
        const val = ref(props.modelValue)
        const updateValue = (e: KeyboardEvent) => {
            const targetValue = (e.target as HTMLInputElement).value
            val.value = targetValue
            context.emit('update:modelValue', targetValue)
        }
        return {
            val,
            updateValue
        }
    }
})S
</script>


## vue中的$attrs属性和inheritAttrs属性

https://www.cnblogs.com/llcdxh/p/10330516.html

一、vue中，默认情况下，调用组件时，传入一些没有在props中定义的属性，会把这些“非法”属性渲染在组件的根元素上（有一些属性除外），而这些“非法”的属性会记录在$attrs属性上。

二、如何控制不把这些非法的属性渲染在组件的根元素上呢？答案是在组件内部设置inheritAttrs:false即可。

三、通过v-bind="$attrs"可以把“非法”的属性渲染到指定的组件某个元素上。

四、如下图![img](https://img2018.cnblogs.com/blog/1429393/201901/1429393-20190128154111602-1389640703.png)

![img](https://img2018.cnblogs.com/blog/1429393/201901/1429393-20190128153837639-80227847.png)

 ![img](https://img2018.cnblogs.com/blog/1429393/201901/1429393-20190128154139607-634987895.png)

![img](https://img2018.cnblogs.com/blog/1429393/201901/1429393-20190128154548610-1902286045.png)



## vue3-teleport组件

> 简单理解就是能将一个组件中的子组件移到父组件外面去，但是任然能够获取到父元素的注入，还可以解决样式受到父元素影响的问题，teleport组件上面有一个to的属性，代表要将teleport包裹的组件渲染到那个组件上面去



在项目中有许多地方都用到了teleport,需要弹出全局的对话框或者加载动画,，由于teleport组件上面有一个to的属性需要一个挂载的元素，我想不用的时候又要销毁这个元素，这时候可以用vue3自定义hook将创建元素节点的逻辑抽离，在这几个地方都使用
