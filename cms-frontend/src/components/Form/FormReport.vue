<script>
  import formMixin from "./mixins/form";
  import { messageSuccess } from "@utils/message";

  const DEFAULT_SUBMIT_DATA = {
    email: '+886',
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
        this.tryToXxxxx()
      },
      tryToXxxxx() {
        alert('tryToXxxxx()');
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
        :class="$style.formReport"
        @submit.prevent.native="handleSubmit(onSubmit)"
      >
        <!--電子郵件-->
        <ValidationProvider
          v-slot="{ errors }"
          rules="require|phone"
          name="手機號碼"
        >
          <el-form-item :error="errors[0]" prop="phone">
            <el-input
              ref="phone"
              v-model="FormMixSubmitData.phone"
              placeholder="輸入手機號碼: 09xxxxxxxx"
              autocomplete="phone"
              inputmode="numeric"
            >
            </el-input>
          </el-form-item>
        </ValidationProvider>
        <BaseButton
          :disabled="invalid"
          class="isStylePrimaryDark isRadius isFull mt-2"
          type="submit"
        >
          下一步資料確認
        </BaseButton>
      </el-form>
    </ValidationObserver>
  </div>
</template>
<style lang="scss" module>
  .formReport {
    :global {
      .formReport {
        @include unstyled;
      }
    }
  }
</style>
