<template>
  <div
    :class="$style.baseError"
  >
    <div>
      <div class="mb-5">
        <div class="fs-2xl fw-medium">
          找不到項目
        </div>
      </div>
      <slot/>
    </div>
  </div>
</template>
<style lang="scss" module>
  .baseError {
    text-align: center;
    padding: 4rem 0;

    :global {
      .baseError {
        @include unstyled;
      }
    }
  }
</style>
