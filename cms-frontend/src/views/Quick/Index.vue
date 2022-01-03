<script>
import { defineAsyncComponent } from 'vue'
import { messageSuccess } from '@utils/message'
import formatGender from '@utils/format-gender'
export default {
  components: {
    Layout: defineAsyncComponent(() => import('@layout/main.vue')),
    // FormQuick: () => import("@components/Form/FormQuick.vue"),
  },
  data() {
    return {
      visibleScan: false,
      info: {
        categoryAlias: 'activity',
        eventId: '',
        eventDateId: '',
        eventSessionId: '',
      },
    }
  },
  methods: {
    async tryToCheckin(code = '') {
      const { eventSessionId: checkinItemId } = this.info
      const {
        items: {
          user: { name, gender, userGroupTitle },
        },
      } = await this.$store.dispatch('order/checkinOrderQrcodeItem', {
        code,
        checkinItemId,
        type: 'session',
      })

      messageSuccess({
        title: '報到成功',
        content: `${name} ${formatGender(gender)} |  ${userGroupTitle}`,
      })
    },
    handleScan(qrcodeId) {
      this.tryToCheckin(qrcodeId)
    },
  },
}
</script>
<template>
  <Layout>
    <div>
      <i class="fal fa-clipboard-list text-center w-100 fa-4x mb-3 text-primary"></i>
      <div class="fs-2xl fw-medium text-center mb-3">
        快速報到請先設定核銷
      </div>
      <div v-for="x in 50">...</div>
    </div>
  </Layout>
</template>
<style lang="scss" module>
.viewQuick {
  :global {
    .viewQuick {
      @include unstyled;
    }
  }
}
:global {
  .ant-menu-submenu:first-of-type {
    margin-top: 4px !important;
  }
  .ant-menu-submenu-title {
    margin-top: 0 !important;
  }
}
</style>
