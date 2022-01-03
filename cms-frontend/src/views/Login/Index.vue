<script setup>
import { defineAsyncComponent, inject, onMounted } from 'vue'

const globalScrollTop = inject('globalScrollTop')
const isLoading = inject('globalIsLoading')
</script>
<script>
import formatAccess from '@utils/format-access'
import findUserRoute from '@utils/find-user-route'
import formatRoutes from '@utils/format-routes'
import testRoutes from '@utils/test-routes'
import asyncRoutes from '@router/async-routes'

export default {
  components: {
    Edit: defineAsyncComponent(() => import('@views/Brands/manager/edit.vue')),
    // FormLogin: () => import("@components/Form/FormLogin.vue"),
  },
  data() {
    return {
      remember: { ...this.$store.state.auth.remember },
      size: 'large',
      submitData: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async onSubmit() {
      await this.$refs.form.validate()
      this.tryToLogin()
    },
    async tryToLogin() {
      await this.$store.dispatch('auth/logIn', this.submitData)

      const updateRememberStore = () => {
        if (this.remember.flag) {
          this.$store.dispatch('auth/setRemember', {
            flag: this.remember.flag,
            info: {
              email: this.submitData.email,
            },
          })
        } else {
          this.$store.dispatch('auth/setRemember', {})
        }
      }

      this.tryToFetchPermission()
      updateRememberStore()
    },
    async tryToFetchPermission() {
      const checkPermission = (routes) => {
        const {
          parent: { visible: parentVisible },
          visible,
        } = findUserRoute('COM_FRONT_DESK_MANAGER_TITLE', routes)
        return !!parentVisible && !!visible
      }
      const generateValidateRoutes = (routes) => {
        return asyncRoutes.filter(({ name }) => Object.keys(findUserRoute(name, routes)).length)
      }

      try {
        const response = await this.$store.dispatch('auth/fetchUserPage')

        if (checkPermission(response)) {
          // const userRoutes = formatRoutes(testRoutes)
          const userRoutes = formatRoutes(response)
          const userAccess = formatAccess(response)
          console.time('generateValidateRoutes')
          const validateRoutes = generateValidateRoutes(userRoutes)
          console.timeEnd('generateValidateRoutes')

          this.$store.dispatch('auth/storeUserRoutes', userRoutes)
          this.$store.dispatch('auth/storeUserAccess', userAccess)

          validateRoutes.forEach((route) => {
            this.$router.addRoute(route)
          })

          this.$message.success('登入成功')
          this.$router.push({
            name: 'COM_BRANDS_MANAGER_TITLE',
          })
        } else {
          this.$store.dispatch('auth/logOut')
          this.$message.error('帳號權限不足，無法登入')
        }
      } catch (e) {
        this.$store.dispatch('auth/setCurrentUser', {})
        this.$router.push('/login')
      }
    },
  },
}
</script>
<template>
  <div :class="$style.wrapper">
    <transition name="form" appear>
      <a-card :class="$style.form">
        <div :class="$style.logo">
          <img src="@assets/images/logo/logo.svg" style=" height: 45px;" />
        </div>
        <a-form ref="form" :model="submitData">
          <a-form-item name="email" required>
            <a-input v-model:value="submitData.email" placeholder="帳號"></a-input>
          </a-form-item>
          <a-form-item name="password" required>
            <a-input-password v-model:value="submitData.password" placeholder="密碼"></a-input-password>
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model:checked="remember.flag">記住帳號</a-checkbox>
          </a-form-item>
          <a-button type="primary" block @click="onSubmit">登入</a-button>
        </a-form>
      </a-card>
    </transition>
  </div>
  <Edit/>
</template>
<style lang="scss" module>
.wrapper {
  background: linear-gradient(to right, #3f6c95 0%, #2f3855 100%);
  height: 100vh;
}

.logo {
  margin-bottom: 25px;
  text-align: center;
}

.form {
  position: absolute;
  min-width: 300px;
  max-width: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 4px;
  :global {
    .ant-card-body {
      padding: 30px;
    }
  }
}

:global {
  .form-enter-active,
  .form-leave-active {
    transition: opacity 1s ease-in-out;
  }

  .form-enter-from,
  .form-leave-to {
    opacity: 0;
  }
}
</style>
