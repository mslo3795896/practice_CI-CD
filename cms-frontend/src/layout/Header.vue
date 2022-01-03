<script>
import { authComputed } from '@store/helpers'

export default {
  computed: {
    ...authComputed,
    currentUserName() {
      return this.currentUser?.name
    },
    collapsed: {
      get() {
        return this.$store.state.global.menuCollapsed
      },
      set(value) {
        this.$store.dispatch('global/toggleMenu', value)
      },
    },
  },
  methods: {
    onClickDropdown(command) {
      if (command === 'logout') this.tryToLogout()
    },
    async tryToLogout() {
      await this.$store.dispatch('auth/logOut')

      this.$router.push({
        name: 'login',
      })
    },
  },
}
</script>
<template>
  <a-layout-header :class="$style.header" :style="`${collapsed ? 'left: 80px;' : ''}`">
    <a-row :class="$style.navbar" type="flex" justify="space-between" align="middle">
      <a-col :span="12">
        <i v-if="collapsed" class="fal fa-clipboard-list fa-2x text-primary" @click="collapsed = !collapsed" />
        <i v-else class="fal fa-clipboard-list fa-2x" @click="collapsed = !collapsed" />
      </a-col>
      <a-col :span="12" class="text-right">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            {{ currentUserName }}
            <i class="fas fa-caret-down" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0" @click="tryToLogout">
                登出
                <i class="fal fa-sign-out" />
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-col>
    </a-row>
  </a-layout-header>
</template>
<style lang="scss" module>
.header {
  position: fixed;
  z-index: 1;
  background: #fff !important;
  top: 0;
  left: 200px;
  right: 0;
  transition: all 0.2s;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.15);
  height: auto;
  padding: 0;
}

.navbar {
  padding: 0 20px;
}
</style>
