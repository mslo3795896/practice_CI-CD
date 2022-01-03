<script>
import { authComputed, globalComputed } from '@store/helpers'
import menuList from './menu'

export default {
  data() {
    return {
      activeMenu: [this.$route.name],
    }
  },
  computed: {
    ...authComputed,
    ...globalComputed,
    userMenuList() {
      return menuList
    },
  },
}
</script>
<template>
  <footer :class="$style.footer">
    <a-menu v-model:selectedKeys="activeMenu" mode="horizontal">
      <router-link v-for="menu in userMenuList" :key="menu.name" :to="{ name: menu.name }">
        <a-menu-item :key="menu.name">
          <i :class="`fal fa-${menu.icon}`"></i>
          {{ menu.title }}
        </a-menu-item>
      </router-link>
    </a-menu>
  </footer>
</template>
<style lang="scss" module>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e6e6e6;
  height: auto;
  padding-bottom: 15px;
  padding-top: 15px;
  justify-content: space-between;
  box-shadow: 0 -5px 10px 0px #1a1d000b;
  :global {
    .ant-menu {
      flex-grow: 2;
      flex-basis: 0;
      display: flex;
      justify-content: center;
      border-bottom: none !important;
      background: transparent;
      .router-link-active {
        .ant-menu-item {
          color: inherit;
          i {
            color: inherit;
          }
        }
      }
      .ant-menu-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: auto;
        line-height: 30px;
        color: #c6c6ba;
        border: none;
        color: #3f3a2e;
        & + .ant-menu-item {
          margin-left: 30px;
        }
        &:not(.is-disabled):hover,
        &:not(.is-disabled):focus {
          background: transparent;
          color: $color-primary;
          i {
            color: $color-primary;
          }
        }
        &.is-active {
          border-bottom-width: 3px !important;
          color: $color-primary !important;
          @include max-sm {
            border: none;
          }
        }
        i {
          display: inherit;
          font-size: 24px;
          width: 1em;
          transition: color 0.3s;
        }
      }
    }
  }
}
</style>
