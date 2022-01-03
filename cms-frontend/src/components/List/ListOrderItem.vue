<script>
  import { eventCategoryTitle } from "@utils/zerone-event";
  import formatGender from "@utils/format-gender";

  export default {
    props: {
      orderItem: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    computed: {
      categoryTitle() {
        return eventCategoryTitle(this.orderItem.category)
      }
    },
    methods: {
      formatGender,
    }
  }
</script>
<template>
  <div :class="$style.listOrderItem">
    <div class="listOrderItem__name">
      <span v-if="!!orderItem.fullName">{{ orderItem.fullName }}</span>
      <span v-if="!!orderItem.gender"> {{ formatGender(orderItem.gender) }}</span>
    </div>
    <div
      v-if="orderItem.userGroupTitle"
      class="listOrderItem__groupTitle"
    >
      {{ orderItem.userGroupTitle }}
    </div>
    <div
      v-if="orderItem.phoneNumber"
      class="listOrderItem__phone"
    >
      {{ orderItem.phoneNumber }}
    </div>
    <div
      v-if="orderItem.orderNum"
      class="listOrderItem__orderNum"
    >
      #{{ orderItem.orderNum }}
    </div>
  </div>
</template>
<style lang="scss" module>
  .listOrderItem {
    :global {
      .listOrderItem {
        &__name {
          line-height: 1.75;
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        &__groupTitle, &__phone, &__orderNum {
          font-size: 0.875rem;
          line-height: 1.75;
          color: $color-gray-6;
        }
      }
    }
  }
</style>
