<script>
import { provide } from 'vue'
import zh_TW from 'ant-design-vue/es/locale/zh_TW'
import _throttle from 'lodash/throttle'

import useGlobalComputed from '@utils/setup/global-computed'
import * as globalLoading from '@utils/setup/global-loading'
import scrollToElement from '@plugins/scroll-to-element'

import appConfig from '@src/app.config'
import { authComputed } from '@store/helpers'
import getScrollTop from '@utils/get-scroll-top'

export default {
  setup(props) {
    const globalComputed = useGlobalComputed()

    provide('$scrollToElement', scrollToElement)
    for (let key in globalComputed) {
      provide(key, globalComputed[key])
    }

    // 遍歷 Symbol
    Reflect.ownKeys(globalLoading).forEach((key) => {
      if (typeof key !== 'symbol') {
        provide(key, globalLoading[key])
      }
    })

    return {
      ...globalComputed,
    }
  },
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
  name: 'App',
  data() {
    return {
      locale: zh_TW,
    }
  },
  computed: {
    ...authComputed,
  },
  mounted() {
    console.log('globalScrollTop', this.globalScrollTop)

    const initScrollListener = () => {
      window.addEventListener('scroll', this.onScroll)
    }

    const initVarVh = () => {
      this.varVh = window.innerHeight * 0.01
    }

    initVarVh()

    window.addEventListener('resize', () => {
      initVarVh()
    })

    const initLocalStorageListener = () => {
      window.onstorage = (e) => {
        const authKey = 'checkin.auth.currentUser'
        if (e.key === authKey) {
          const newValue = JSON.parse(e.newValue)

          this.$store.dispatch('auth/setCurrentUser', newValue)

          const checkIsLoginPage = () => {
            if (this.$route.meta.isLoginPage) {
              if (!this.loggedIn) {
                this.$router.push({
                  name: 'login',
                  query: {
                    redirectFrom: location.pathname,
                  },
                })
              }
            }
          }

          const checkIsLogoutPage = () => {
            if (this.$route.meta.isLogoutPage) {
              if (this.loggedIn) {
                window.location = this.$route.query.redirectFrom || '/member'
              }
            }
          }

          checkIsLogoutPage()
          checkIsLoginPage()
        }
      }
    }

    initScrollListener()
    initLocalStorageListener()
  },
  methods: {
    onScroll: _throttle(function() {
      const scrollTop = getScrollTop()

      if (scrollTop > this.globalScrollTop) {
        this.globalDirection = 'down'
      } else {
        this.globalDirection = 'up'
      }

      this.globalScrollTop = scrollTop
    }, 200),
  },
}
</script>
<template>
  <a-config-provider :locale="locale">
    <div :class="{ isDevelopment: globalIsDevelopment }">
      <RouterView :key="$route.fullPath" />
    </div>
  </a-config-provider>
</template>

<style lang="scss">
/* @import '/node_modules/normalize.css/normalize.css';
  @import '/node_modules/nprogress/nprogress.css';
  @import '@styles/index.scss'; */
</style>
