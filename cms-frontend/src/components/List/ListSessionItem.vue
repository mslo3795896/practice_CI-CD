<script>
  import { FAKE_ORDER_QRCODE } from "@src/config/fake-order-qrcode";
  import { eventCategoryTitle } from "@utils/zerone-event";

  export default {
    props: {
      sessionItem: {
        type: Object,
        default: () => {
          return FAKE_ORDER_QRCODE.items[0]
        }
      },
    },
    computed: {
      categoryTitle() {
        return eventCategoryTitle(this.sessionItem.category)
      }
    }
  }
</script>
<template>
  <div
    v-if="!!sessionItem"
    :class="$style.listSessionItem"
  >
    <div class="listSessionItem__date">
      {{ sessionItem.time }}
    </div>
    <div class="listSessionItem__title">
      {{ sessionItem.title }}
    </div>
    <div class="listSessionItem__category">
      {{ categoryTitle }}
    </div>
    <div class="listSessionItem__categoryTitle">
      {{ sessionItem.eventTitle }}
    </div>
  </div>
</template>
<style lang="scss" module>
  .listSessionItem {
    :global {
      .listSessionItem {
        &__date {
          color: $color-gray-6;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        &__title {
          // @include line-clamp(2, 3.5em);

          line-height: 1.75;
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 1.25rem;
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
