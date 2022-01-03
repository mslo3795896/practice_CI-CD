<script>
  import formMixin from "./mixins/form";
  const DEFAULT_SUBMIT_DATA = {
    email: '',
    password: '',
  };

  export default {
    mixins: [formMixin],
    props: {
      value: {
        type: Object,
        default: () => {
          return { ...DEFAULT_SUBMIT_DATA }
        },
      },
    },
    data() {
      return {
        showPassword: false,
      }
    },
    methods: {
      onSubmit() {
        this.tryToLogin();
      },
      tryToLogin() {
        this.$FormMixinOnSubmitSuccess();
      },
    }
  }
</script>
<template>
  <div>
    <ValidationObserver v-slot="{ invalid, handleSubmit }">
      <el-form
        ref="form"
        :model="FormMixSubmitData"
        label-position="top"
        class="isStyleBase"
        :class="$style.formLogin"
        @submit.prevent.native="handleSubmit(onSubmit)"
      >
        <!--電子郵件-->
        <ValidationProvider
          v-slot="{ errors }"
          rules="require|email"
          name="電子郵件"
        >
          <el-form-item :error="errors[0]" prop="email">
            <el-input
              ref="email"
              v-model="FormMixSubmitData.email"
              placeholder="電子郵件"
              autocomplete="email"
              inputmode="email"
            >
            </el-input>
          </el-form-item>
        </ValidationProvider>
        <!--密碼-->
        <ValidationProvider
          v-slot="{ errors }"
          name="密碼"
          rules="require"
        >
          <el-form-item :error="errors[0]" prop="password">
            <el-input
              v-model="FormMixSubmitData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="密碼"
              class="isStylePassword"
            >
              <el-button
                slot="append"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fa-eye' : 'fa-eye-slash'" class="fa-lg fal"></i>
              </el-button>
            </el-input>
          </el-form-item>
        </ValidationProvider>
        <BaseButton
          :loading="$isLoading('logIn') || $isLoading('fetchUserPage')"
          :disabled="invalid"
          class="isStylePrimary isRadius isFull mt-5"
          type="submit"
        >
          登入
        </BaseButton>
      </el-form>
    </ValidationObserver>
  </div>
</template>
<style lang="scss" module>
  .formLogin {
    :global {
      .formLogin {
        @include unstyled;
      }
    }
  }
</style>
