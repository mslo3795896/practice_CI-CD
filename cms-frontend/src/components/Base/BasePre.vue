<script>
import { computed, reactive } from 'vue'
import { getLocalStorage, saveLocalStorage } from '@utils/localStorage'
// import Vue from 'vue'
import message from '@utils/message'

/* const observableData = Vue.observable({
    isDisplayPre: getLocalStorage('set.displayPre')
  }); */

export default {
  setup() {
    const observableData = reactive({
      isDisplayPre: getLocalStorage('set.displayPre'),
    })

    const isSuperAdmin = computed(() => observableData.isDisplayPre === 'ZAT')
    const isActive = computed(() => import.meta.env.MODE === 'development' || isSuperAdmin || false)
    const isDisplayPre = computed({
      get: () => {
        return (observableData.isDisplayPre && isActive) || isSuperAdmin
      },
      set: (value) => {
        observableData.isDisplayPre = value
      },
    })

    return {
      observableData,
      isSuperAdmin,
      isActive,
      isDisplayPre,
    }
  },
  /* computed: {
      isSuperAdmin() {
        return observableData.isDisplayPre === 'ZAT'
      },
      isActive() {
        return import.meta.env.MODE === 'development' || this.isSuperAdmin || false
      },
      isDisplayPre: {
        get() {
          return (observableData.isDisplayPre && this.isActive) || this.isSuperAdmin
        },
        set(value) {
          observableData.isDisplayPre = value
        },
      },
    }, */
  mounted() {
    const initKeydownListener = () => {
      const dataContainer = document.querySelector('body')

      const isNotInit = dataContainer.getAttribute('data-dispaly-pre') !== 'true'

      if (isNotInit && this.isActive) {
        const setData = () => {
          dataContainer.setAttribute('data-dispaly-pre', 'true')
        }

        setData()
        window.addEventListener('keydown', this.onKeydown)
      }
    }

    initKeydownListener()
  },
  methods: {
    showAlert() {
      alert('HI')
    },
    onKeydown(event) {
      const e = event || window.event
      if (e.ctrlKey && e.shiftKey && e.altKey && e.keyCode === 80) {
        const setDisplayPre = (value) => {
          this.isDisplayPre = value
          saveLocalStorage('set.displayPre', value)

          message({
            title: 'Ctrl⌃ + Shift⇧ + Alt⌥ + P',
            content: `&lt;BasePre/&gt; 切換至${value ? '顯示' : '隱藏'}模式`,
            duration: 2,
            type: value ? 'success' : 'info',
          })
        }

        setDisplayPre(!this.isDisplayPre.value)
      }
    },
  },
}
</script>
<template>
  <pre v-if="isDisplayPre" :class="$style.basePre">
    <slot/>
  </pre>
</template>
<style lang="scss" module>
.basePre {
  position: relative;
  display: block;
  padding: 1rem 1rem 2rem;
  margin: 2rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  text-align: left;
  background: lighten($color-primary, 35%);
  border-left: 5px solid $color-primary;
  border-radius: 1rem;
  box-shadow: 2px 8px 36px #1c2c5414;

  &::before {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    color: $color-primary;
    content: 'PRE';
  }

  &::selection {
    background: $color-primary;
  }

  :global {
    .basePre {
    }
  }
}
</style>
