<script>
  import { checkinStatusItem, regStatusItem } from "@utils/zerone-status";
  import { messageSuccess } from "@utils/message";
  import formatGender from "@utils/format-gender";

  export default {
    components: {
      ListOrderItem: () => import("@components/List/ListOrderItem.vue"),
    },
    props: {
      orderList: {
        type: Array,
        default: () => []
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
      onReview(orderItem) {
        this.$confirm('是否確定此場次完成報到？', '報到確認', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.tryToCheckinSessionItem(orderItem);
          })
      },
      tryToCheckinSessionItem(orderItem) {
        this.$store.dispatch('order/checkinSessionItem', {
          orderId: orderItem.id,
        })
          .then((response) => {
            messageSuccess({
              title: '報到成功',
              content: `${ orderItem.fullName } ${ formatGender(orderItem.gender) } |  ${orderItem.userGroupTitle}`,
            });

            this.$emit('reloadList')
          })
      }
    }
  }
</script>
<template>
  <div :class="$style.listOrder">
    <div
      v-for="(orderItem, index) in orderList"
      :key="`orderList-${index}`"
      class="listOrder__item"
    >
      <div
        v-if="type === 'review'"
        class="d-flex justify-content-between align-items-center mb-2"
        style="height: 30px"
      >
        <div>
          <el-tag
            :class="checkinStatusItem(orderItem.checkinStatus).class"
          >
            {{ checkinStatusItem(orderItem.checkinStatus).text }}
          </el-tag>
          <el-tag
            v-if="orderItem.checkinStatus === 'FORBIDDEN'"
            class="ml-2"
            :class="regStatusItem(orderItem.regStatus).class"
          >
            {{ regStatusItem(orderItem.regStatus).text }}
          </el-tag>
        </div>

        <BaseButton
          v-if="orderItem.checkinStatus === 'CHECKIN'"
          class="isStylePrimaryDark isSmall isRadius"
          @click="onReview(orderItem)"
        >
          <i class="fal fa-check mr-1"></i>
          報到
        </BaseButton>
      </div>
      <ListOrderItem
        :order-item="orderItem"
      />
    </div>
  </div>
</template>
<style lang="scss" module>
  .listOrder {
    :global {
      .listOrder {
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
