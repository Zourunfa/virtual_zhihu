import Message from './Message.vue'
import { createApp } from 'vue'
type MessageType = "success" | "error" | "default";

const createMessage = (message: string, type: MessageType, timeOut = 1300) => {
  const messageInstance = createApp(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  // 将生成的message组件挂载到这个刚刚创建的节点
  messageInstance.mount(mountNode)
  setTimeout(() => {
    messageInstance.unmount(mountNode)
    document.body.removeChild(mountNode)
  }, timeOut)
}

export default createMessage