<script>
  import { checkinStatusItem, regStatusItem } from "@utils/zerone-status";
  import { messageSuccess, messageError } from "@utils/message";
  import formatGender from "@utils/format-gender";

  export default {
    components: {
      ListSessionItem: () => import("@components/List/ListSessionItem.vue"),
    },
    props: {
      sessionList: {
        type: Array,
        default: () => {
          return []
        }
      },
      sessionUserItem: {
        type: Object,
        default: () => {
          return {}
        }
      },
      type: {
        type: String,
        default: 'review',
        validator(value) {
          return [
            'review',
            'normal',
          ].includes(value)
        },
      },
    },
    methods: {
      checkinStatusItem(checkinStatus) {
        return checkinStatusItem(checkinStatus)
      },
      regStatusItem(regStatus) {
        return regStatusItem(regStatus)
      },
      onReview(sessionItem) {
        this.$confirm('是否確定此場次完成報到？', '報到確認', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.tryToCheckinOrderQrcodeItem(sessionItem);
          })
      },
      tryToCheckinOrderQrcodeItem(sessionItem) {
        this.$store.dispatch('order/checkinOrderQrcodeItem', {
          code: this.$route.params.qrcodeId,
          checkinItemId: sessionItem.checkinItemId,
          type: sessionItem.type,
        })
          .then((response) => {
            messageSuccess({
              title: '報到成功',
              content: `${this.sessionUserItem.name} ${formatGender(this.sessionUserItem.gender)} | ${this.sessionUserItem.userGroupTitle}`,
            });

            this.$emit('reloadList')
          })
          .catch((error) => {
            messageError({
              title: '報到失敗',
              content: error.message,
            });
          })
      }
    }
  }
</script>
<template>
  <div :class="$style.listSession">
    <div
      v-for="(sessionItem, index) in sessionList"
      :key="`sessionList-${index}`"
      class="listSession__item"
    >
      <div
        v-if="type === 'review'"
        class="d-flex justify-content-between align-items-center mb-2"
        style="height: 30px"
      >
        <div>
          <el-tag
            :class="checkinStatusItem(sessionItem.checkinStatus).class"
          >
            {{ checkinStatusItem(sessionItem.checkinStatus).text }}
          </el-tag>
          <el-tag
            v-if="sessionItem.checkinStatus === 'FORBIDDEN'"
            class="ml-2"
            :class="regStatusItem(sessionItem.regStatus).class"
          >
            {{ regStatusItem(sessionItem.regStatus).text }}
          </el-tag>
        </div>
        <BaseButton
          v-if="sessionItem.checkinStatus === 'CHECKIN'"
          class="isStylePrimaryDark isSmall isRadius"
          @click="onReview(sessionItem)"
        >
          <i class="fal fa-check mr-1"></i>
          報到
        </BaseButton>
      </div>
      <ListSessionItem
        :session-item="sessionItem"
      />
    </div>
  </div>
</template>
<style lang="scss" module>
  .listSession {
    :global {
      .listSession {
        &__item {
          padding: 1.5rem 0;

          &:not(:last-child) {
            border-bottom: 1px solid $color-line;
          }
        }

        &__date {
          color: $color-gray-6;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        &__title {
          @include line-clamp(2, 3.5em);

          line-height: 1.75;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        &__category {
          color: $color-primary;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        &__categoryTitle {
          @include line-clamp(1, 1.5em);

          font-size: 0.875rem;
        }
      }
    }
  }
</style>
