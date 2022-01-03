<script>
import { defineAsyncComponent } from 'vue'
import useList from '@composition/list'

export default {
  setup() {
    const LIST = useList({
      api: 'brand',
      filterData: {
        search: undefined,
        state: undefined,
      },
    })
    return {
      ...LIST,
    }
  },
  components: {
    Layout: defineAsyncComponent(() => import('@layout/main.vue')),
    // FormQuick: () => import("@components/Form/FormQuick.vue"),
  },
  computed: {
    page() {
      return this.paginations.page_size
    },
  },
}
</script>
<template>
  <Layout>LIST: {{ page }}</Layout>
</template>
