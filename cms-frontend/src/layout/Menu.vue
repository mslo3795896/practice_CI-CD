<script>
export default {
  components: {},
  props: {
    collapsed: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      selectedKeys: ['1'],
    }
  },
  methods: {},
}
</script>

<template>
  <a-layout-sider v-model:collapsed="collapsed" :trigger="null" :class="$style.menu" collapsible>
    <div :class="$style.logo" />
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
      <a-menu-item key="1">
        <i class="fal fa-clipboard-list text-primary"></i>
        <span>nav 1</span>
      </a-menu-item>
      <a-menu-item key="2">
        <i class="fal fa-clipboard-list text-primary"></i>
        <span>nav 2</span>
      </a-menu-item>
      <a-menu-item key="3">
        <i class="fal fa-clipboard-list text-primary"></i>
        <span>nav 3</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<style lang="scss" module>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.menu {
  overflow: scroll;
  height: 100%;
  position: fixed !important;
  left: 0;
}
</style>
