<script>
  import Layout from '@layout/main.vue'

  export default {
    components: { Layout },
  }
</script>

<template>
  <Layout>
    <h1 :class="$style.title">
      The page timed out while loading. Are you sure you're still connected to
      the Internet?
    </h1>
  </Layout>
</template>

<style lang="scss" module>
  .title {
    text-align: center;
  }
</style>
