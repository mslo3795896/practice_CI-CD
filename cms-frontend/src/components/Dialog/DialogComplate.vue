<script>
  import dialogMixin from "./mixins/dialog";
  import formatGender from "@utils/format-gender";
  import { FAKE_ORDER_QRCODE } from "@src/config/fake-order-qrcode";

  export default {
    components: {
      ListSessionItem: () => import("@components/List/ListSessionItem.vue"),
    },
    mixins: [dialogMixin],
    props: {
      sessionUser: {
        type: Object,
        default: () => {
          return FAKE_ORDER_QRCODE.user
        },
      },
      sessionItem: {
        type: Object,
        default: () => {
          return FAKE_ORDER_QRCODE.items[0]
        },
      }
    },
    methods: {
      formatGender,
    }
  }
</script>
<template>
  <el-dialog
    :visible.sync="dialogMixinDialogVisible"
    :before-close="$DialogMixinOnClose"
    :custom-class="`${ $style.dialogContact } isStyleBase text-center`"
    width="414px"
    append-to-body
  >
    <div class="mb-4">
      <i class="fal fa-check-circle fa-4x text-primary-dark mb-2"></i>
      <div class="fs-2xl fw-medium text-center mb-3">
        報到完成
      </div>
    </div>
    <div
      v-if="!!sessionUser && !!sessionItem"
      :class="$style.sectionList"
    >
      <div
        v-if="!!sessionUser"
        class="sectionList__item"
      >
        <BaseUserInfo
          v-if="!!sessionUser"
          :name="sessionUser.name"
          :gender="formatGender(sessionUser.gender)"
          :user-group-title="sessionUser.userGroupTitle"
          :phone="sessionUser.phone"
        />
      </div>
      <div
        v-if="!!sessionItem"
        class="sectionList__item"
      >
        <ListSessionItem
          :session-item="sessionItem"
        />
      </div>
    </div>
    <BaseButton
      class="isStyleDark isOutline isRadius isFull"
      @click="$DialogMixinOnClose"
    >
      關閉視窗
    </BaseButton>
  </el-dialog>
</template>
<style lang="scss" module>
  .dialogContact {
    :global {
      .dialogContact {
        @include unstyled;
      }
    }
  }

  .sectionList {
    border: 1px solid $color-line;
    border-radius: 8px;
    margin-bottom: 2rem;
    :global {
      .sectionList {
        &__item {
          padding: 2rem 1rem;

          &:not(:last-child) {
            border-bottom: 1px dashed $color-line;
          }
        }
      }
    }
  }
</style>
