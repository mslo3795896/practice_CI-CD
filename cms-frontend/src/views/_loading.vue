<script>
  import Layout from '@layout/main.vue'

  export default {
    components: { Layout },
  }
</script>

<template>
  <Layout>
    <!--<Transition appear>
      <BaseIcon :class="$style.loadingIcon" name="sync" spin />
    </Transition>-->
  </Layout>
</template>

<style lang="scss" module>
  .loadingIcon {
    display: block;
    margin: 0 auto;

    // stylelint-disable-next-line selector-class-pattern
    &:global(.v-enter-active) {
      transition: opacity 1s;
    }

    // stylelint-disable-next-line selector-class-pattern
    &:global(.v-enter) {
      opacity: 0;
    }
  }
</style>
