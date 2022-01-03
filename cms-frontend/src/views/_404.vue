<script>
  import Layout from '@layout/main.vue'

  export default {
    components: { Layout },
  }
</script>
<template>
  <Layout>
    <section :class="$style.notFound">
      <div class="container">
        404
      </div>
    </section>
  </Layout>
</template>
<style lang="scss" module>
  .notFound {
    padding-top: 8.25rem;
    padding-bottom: 8.25rem;

    @include max-md {
      padding-top: 4.375rem;
      padding-bottom: 4.375rem;
    }

    :global {
      .notFound {
        &__round {
          width: 30vw;
          height: 30vw;
          margin: 0 auto;
          text-align: center;
          background: $color-gray-2;
          border-radius: 100%;
        }

        &__title {
          font-size: 2.5rem;

          @include max-md {
            font-size: 1.8rem;
          }
        }

        &__content {
          line-height: 1.8;
        }
      }
    }
  }
</style>
