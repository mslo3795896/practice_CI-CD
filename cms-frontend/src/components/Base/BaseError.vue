<template>
  <div
    :class="$style.baseError"
  >
    <div>
      <div class="mb-5">
        <i class="fad fa-exclamation-triangle fa-10x mb-3"></i>
        <div class="fs-2xl fw-medium">
          發生錯誤
        </div>
      </div>
      <BaseButton
        class="isStyleDark isOutline isRadius"
        :to="{ name: 'home' }"
      >
        返回首頁
      </BaseButton>
    </div>
  </div>
</template>
<style lang="scss" module>
  .baseError {
    text-align: center;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;

    :global {
      .baseError {
        @include unstyled;
      }
    }
  }
</style>
