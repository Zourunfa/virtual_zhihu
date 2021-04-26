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