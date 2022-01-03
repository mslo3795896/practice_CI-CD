<script>
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      gender: {
        type: String,
        default: ''
      },
      userGroupTitle: {
        type: String,
        default: ''
      },
      phone: {
        type: String,
        default: ''
      }
    },
  };
</script>

<template>
  <div class="text-center">
    <div class="fs-2xl fw-medium mb-3">
      <span v-if="!!name">{{ name }}</span>
      <span v-if="!!gender"> {{ gender }}</span>
    </div>
    <div class="text-gray-6">
      <span v-if="!!userGroupTitle">{{ userGroupTitle }}</span>
      <span> | </span>
      <span v-if="!!phone">{{ phone }}</span>
    </div>
  </div>
</template>
<style lang="scss" module>
  .baseUserInfo {
    text-align: center;

    :global {
      .baseUserInfo {
        @include unstyled;
      }
    }
  }
</style>
