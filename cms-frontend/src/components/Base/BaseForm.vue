<script>
import { ref, inject, onMounted, onUnmounted } from 'vue'

export default {
  setup(props, context) {
    const formRef = ref()
    const rid = Math.floor(Math.random()*10000)+10000
    const addToParent = inject('addForm')
    const deleteFromParent = inject('deleteForm')

    onMounted(() => {
      addToParent(formRef.value, rid)
    })

    onUnmounted(() => {
      deleteFromParent(rid)
    })
    
    return {
      formRef,
    }
  },
  /* props: {
    submitData: {
      type: Object,
      default: () => {}
    }
  }, */
  components: {
  },
  data() {
    return {
    }
  },
  computed: {},
}
</script>
<template>
  <a-form ref="formRef" v-bind="$attrs" :layout="'vertical'">
    <slot/>        
  </a-form>
</template>
<style lang="scss" module>
</style>
