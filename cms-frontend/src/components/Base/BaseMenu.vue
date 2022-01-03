<script>
  export default {
    props: {
      menuList: {
        type: Array,
        default: () => {
          return [
            {
              title: '快速報到',
              text: '掃描 QR code 快速報到',
              class: '',
              titleClass: '',
              textClass: '',
              onClick: (data) => {
                return data
              }
            }
          ]
        }
      }
    },
  };
</script>

<template>
  <div :class="$style.baseMenu">
    <div :class="$style.menuList">
      <button
        v-for="(menuItem, index) in menuList"
        :key="index"
        class="menuList__item"
        :class="menuItem.class"
        @click="menuItem.onClick ? menuItem.onClick() : ''"
      >
        <div
          class="menuList__title"
          :class="menuItem.titleClass"
        >
          {{ menuItem.title }}
        </div>
        <div
          class="menuList__text"
          :class="menuItem.textClass"
        >
          {{ menuItem.text }}
        </div>
      </button>
    </div>
  </div>
</template>
<style lang="scss" module>
  .baseMenu {
    :global {
      .baseMenu {

      }
    }
  }

  .menuList {
    :global {
      .menuList {
        &__item {
          background-color: rgba($color-primary, 0.15);
          padding: 1.5rem;
          border-radius: 5px;
          border: 2px solid rgba($color-primary, 0.75);
          text-align: center;
          width: 100%;
          transition: background-color 0.3s, border-color 0.3s;
          &:not(:last-child) {
            margin-bottom: 1rem;
          }

          &:hover {
            background-color: rgba($color-primary, 0.25);
            border-color: darken($color-primary, 10%);
            .menuList {
              &__text, &__title {
                color: darken($color-primary, 10%);
              }
            }
          }

          &:active {
            background-color: rgba($color-primary, 0.3);
            border-color: $color-primary;
          }
        }

        &__title {
          color: $color-primary;
          font-size: $font-size-lg;
          font-weight: 500;
          margin-bottom: 0.25rem;
          transition: color 0.3s;
        }

        &__text {
          color: $color-gray-4;
          transition: color 0.3s;
        }
      }
    }
  }
</style>
