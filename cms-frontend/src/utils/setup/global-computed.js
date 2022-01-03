import { computed, reactive } from 'vue'

export default function useGlobalComputed() {
  const scroll = reactive({
    top: 0,
    direction: '',
  })

  const COMPUTED = {
    globalScrollTop: computed({
      get: () => {
        return scroll.top
      },
      set: (value) => {
        scroll.top = value
      },
    }),
    globalDirection: computed({
      get: () => {
        return scroll.direction
      },
      set: function(value) {
        scroll.direction = value
      },
    }),
    globalIsMobileDevice: computed({
      get: () => {
        return /Mobi|Android/i.test(navigator.userAgent)
      },
    }),
    globalIsTouchDevice: computed({
      get: () => {
        return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
      },
    }),
    globalIsDevelopment: computed({
      get: () => {
        return import.meta.env.MODE === 'development'
      },
    }),
    globalIsOfficial: computed({
      get: () => {
        return import.meta.env.MODE === 'production'
      },
    }),
  }

  return {
    ...COMPUTED,
  }
}
