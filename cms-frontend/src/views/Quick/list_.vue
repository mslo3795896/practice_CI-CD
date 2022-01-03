<script>
  import formatGender from "@utils/format-gender";
  import { FAKE_ORDER_QRCODE } from "@src/config/fake-order-qrcode";

  export default {
    components: {
      Layout: () => import("@layout/main.vue"),
      ListSession: () => import("@components/List/ListSession.vue"),
    },
    data() {
      return {
        sessionUser: null,
        sessionList: [],
        sessionPagination: null,
        submitData: {
          search: ''
        },
      }
    },
    created() {
      this.tryToFetchOrderQrcodeItem();
    },
    methods: {
      formatGender,
      onSubmitCallback() {

      },
      onChangePagination(page) {
        this.tryToFetchOrderQrcodeItem({
          storeParams: {
            page
          }
        });
      },
      goBack() {
        this.$router.go(-1)
      },
      tryToFetchOrderQrcodeItem({ storeParams } = {}) {
        /* const devTest = () => {
          this.$startLoading('fetchOrderQrcodeItem');

          setTimeout(() => {
            this.sessionUser = FAKE_ORDER_QRCODE.user;
            this.sessionList = FAKE_ORDER_QRCODE.items;
            this.sessionPagination = FAKE_ORDER_QRCODE.pagination;

            this.$endLoading('fetchOrderQrcodeItem');
          }, 300)
        };

        devTest(); */

        // http://localhost:2078/checkin/quick/4v0CbhJgMbteUXzlVfqyAxVFqnzwuehVOGsFQTR2hgbDUl6lq8Ny7fsARSI1PZI7rPogQbcAxiyyG9sLug1GQqCcDA1E7gyj8guIM0qWmITq23ev46JyeSj5noCp61cM/checkin

        this.$store.dispatch('order/fetchOrderQrcodeItem', {
          code: this.$route.params.qrcodeId,
         ...storeParams
        })
        .then((response) => {
          this.sessionUser = response.user;
          this.sessionList = response.items;
          this.sessionPagination = response.pagination;
        })
      },
    },
  }
</script>
<template>
  <Layout :class="$style.viewQuickList">
    <div class="container">
      <div
        v-loading.fullscreen="($isLoading('fetchOrderQrcodeItem') && !sessionUser) || $isLoading('checkinOrderQrcodeItem')"
        :element-loading-text="$isLoading('checkinOrderQrcodeItem') ? '正在處理' : '正在取得清單'"
        class="section"
      >
        <BaseButton
          class="isStylePrimary isText"
          @click="goBack"
        >
          <i class="fal fa-chevron-left mr-2"></i>返回
        </BaseButton>
        <BaseUserInfo
          v-if="!!sessionUser"
          :name="sessionUser.name"
          :gender="formatGender(sessionUser.gender)"
          :user-group-title="sessionUser.userGroupTitle"
          :phone="sessionUser.phone"
        />
        <hr style="border-top-style: dashed;">
        <!--<el-input
          ref="search"
          v-model="submitData.search"
          prefix-icon="el-icon-search"
          placeholder="搜尋"
        />-->
        <ListSession
          v-loading="$isLoading('fetchOrderQrcodeItem')"
          element-loading-text="正在取得清單"
          type="review"
          class="viewQuickList__list"
          :session-list="sessionList"
          @reloadList="tryToFetchOrderQrcodeItem"
        />
        <BasePagination
          :pagination="sessionPagination"
          class="viewQuickList__pagination"
          @change="onChangePagination"
        />
      </div>
    </div>
  </Layout>
</template>
<style lang="scss" module>
  .viewQuickList {
    :global {
      .viewQuickList {
        &__list {
          @include unstyled;
        }

        &__pagination {
          @include unstyled;
        }
      }
    }
  }
</style>
