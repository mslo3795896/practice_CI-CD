<script>
  import formatDate from '@utils/format-date'
  import _debounce from "lodash/debounce";
  import { messageSuccess } from "@utils/message";
  import formatGender from "@utils/format-gender";

  export default {
    components: {
      ListOrder: () => import("@components/List/ListOrder.vue"),
      Layout: () => import("@layout/main.vue"),
      ListSessionItem: () => import('@components/List/ListSessionItem.vue')
    },
    data() {
      return {
        sessionItem: null,
        orderList: [],
        orderPagination: null,
        submitData: {
          search: ''
        },
        activeTab: 'CHECKIN',
        visibleScan: false,
      }
    },
    created() {
      this.tryToFetchSessionItem();
      this.tryToFetchSessionOrderList();
    },
    methods: {
      onChangePagination(page) {
        this.tryToFetchSessionOrderList({
          storeParams: {
            page
          }
        });
      },
      tryToFetchSessionItem() {
        this.$store.dispatch('order/fetchSessionItem', {
          sessionId: this.$route.params.sessionId
        })
          .then((response) => {
            const date = formatDate(response.items.startTime, 'yyyy/MM/dd');
            const startTime = formatDate(response.items.startTime, 'hh:ss');
            const endTime = formatDate(response.items.endTime, 'hh:ss');

            this.sessionItem = {
              title: response.items.title,
              time: `${date} [${startTime} ~ ${endTime}]`,
              eventTitle: response.items.eventTitle,
              category: response.items.category,
            }
          })
          .catch(() => {
            this.$router.push({
              name: 'quick',
            })
          })
      },
      tryToFetchSessionOrderList() {
        this.$store.dispatch('order/fetchSessionOrderList', {
          ...this.submitData,
          checkinStatus: this.activeTab === 'all' ? undefined : this.activeTab,
          sessionId: this.$route.params.sessionId
        })
          .then((response) => {
            this.orderList = response.items;
            this.orderPagination = response.pagination;

            this.$scrollToElement({
              $el: this.$refs['tab'].$el,
              offset: -180,
            });
          })
          .catch(() => {
            this.$router.push({
              name: 'quick',
            })
          })
      },
      onChangeSearch: _debounce(function () {
        this.tryToFetchSessionOrderList();
      }, 300),
      onClearSearch() {
        this.submitData.search = ''
      },
      goBack() {
        this.$router.push({name: 'quick'})
      },
      onTabClick() {
        this.tryToFetchSessionOrderList();
      },
      async tryToCheckin(code = '') {
        const {items: {user: {name, gender, userGroupTitle}}} = await this.$store.dispatch("order/checkinOrderQrcodeItem", {
          code,
          checkinItemId: this.$route.params.sessionId,
          type: 'session'
        });
        
        messageSuccess({
          title: '報到成功',
          content: `${name} ${formatGender(gender)} |  ${userGroupTitle}`
        })
      },
      handleScan(qrcodeId) {
        this.tryToCheckin(qrcodeId)
      },
    }
  }
</script>
<template>
  <Layout :class="$style.viewEventList">
    <div class="container">
      <div
        v-loading.fullscreen="$isLoading('checkinSessionItem')"
        :element-loading-text="'正在處理'"
        class="section"
      >
        <div class="align-content-center d-flex justify-content-between mb-4">
          <BaseButton
            class="isStylePrimary isText"
            @click="goBack"
          >
            <i class="fal fa-chevron-left mr-2"></i>返回
          </BaseButton>
          <BaseButton
            class="isStylePrimary isOutline isRadius"
            @click="visibleScan = true"
          >
            掃描QRcode
          </BaseButton>
        </div>
        <BaseScan
          :visible.sync="visibleScan"
          @scanned="handleScan"
        />
        
        <div class="viewEventList__infoBox">
          <!--<BaseButton
            class="viewEventList__edit isStylePrimary isText"
            :to="{ name: 'quick' }"
          >
            <i class="fal fa-edit fa-lg"></i>
          </BaseButton>-->
          <ListSessionItem
            v-loading.fullscreen="$isLoading('fetchSessionItem')"
            :element-loading-text="'正在取得資訊'"
            :session-item="sessionItem"
          />
        </div>
        <el-input
          ref="search"
          v-model="submitData.search"
          class="mb-3"
          prefix-icon="el-icon-search"
          placeholder="搜尋(電話號碼, 姓名, 訂單編號)"
          @input="onChangeSearch"
        />
        <el-tabs
          ref="tab"
          v-model="activeTab"
          stretch
          @tab-click="onTabClick"
        >
          <el-tab-pane label="待報到" name="CHECKIN"/>
          <el-tab-pane label="已報到" name="CHECKEDIN"/>
          <el-tab-pane label="全部" name="all"/>
        </el-tabs>
        <template v-if="!$isLoading('fetchSessionOrderList') && !orderList[0]">
          <BaseNull>
            <BaseButton
              v-if="!!submitData.search"
              class="isStyleDark isOutline isRadius"
              @click="onClearSearch"
            >
              清除條件
            </BaseButton>
          </BaseNull>
        </template>
        <template v-else>
          <ListOrder
            v-if="orderList && !!orderList[0]"
            v-loading="$isLoading('fetchSessionOrderList')"
            element-loading-text="正在取得清單"
            type="review"
            :order-list="orderList"
            @reloadList="tryToFetchSessionOrderList"
          />
          <BasePagination
            :pagination="orderPagination"
            class="viewEventList__pagination"
            @change="onChangePagination"
          />
        </template>
      </div>
    </div>
  </Layout>
</template>
<style lang="scss" module>
  .viewEventList {
    :global {
      .viewEventList {
        &__edit {
          position: absolute;
          right: 1rem;
          top: 1.5rem;
        }

        &__infoBox {
          border: 1px solid $color-line;
          border-radius: 8px;
          margin-bottom: 2rem;
          padding: 2rem 1rem;
          position: relative;
        }

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
