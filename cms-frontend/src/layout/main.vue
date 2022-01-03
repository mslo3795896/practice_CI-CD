<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    Menu: defineAsyncComponent(() => import('./Menu.vue')),
    Header: defineAsyncComponent(() => import('./Header.vue')),
  },
  data() {
    return {}
  },
  computed: {
    collapsed: {
      get() {
        return this.$store.state.global.menuCollapsed
      },
    },
  },
  methods: {},
}
</script>

<template>
  <a-layout>
    <Menu :collapsed="collapsed" />
    <a-layout :class="$style.layout" :style="`${collapsed ? 'margin-left: 80px;' : ''}`">
      <Header />
      <a-layout-content :class="$style.content">
        <slot />
      </a-layout-content>
      <a-layout-footer :class="$style.footer">
        <a-row type="flex" justify="space-between" align="middle">
          <a-col :span="12"> © {{ new Date().getFullYear() }} {{ $store.state.global.site_name }}. All Rights Reserved. </a-col>
          <a-col :span="12" class="text-right">
            Powered by
            <a :href="this.$store.state.global.authorLink" target="_blank"> {{ $store.state.global.authorName }}</a>
          </a-col>
        </a-row>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<style lang="scss" module>
.layout {
  margin-left: 200px;
  transition: all 0.2s;
}

.content {
  margin: 24px 16px;
  margin-top: 88px;
  padding: 24px;
  background: #fff;
  min-height: calc(100vh - 88px - 24px - 61px);
}

.footer {
  border-top: 1px solid #e4e7ed;
  color: #1a1a1a !important;
  line-height: 60px;
  background: #fff !important;
  padding: 0 20px !important;
}
</style>
