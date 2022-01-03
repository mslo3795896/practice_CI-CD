import store from '@store'

export function globalStartLoading(loaderMessage) {
  store.dispatch('loading/setLoadingStart', loaderMessage, {
    root: true,
  })
}
export function globalEndLoading(loaderMessage) {
  store.dispatch('loading/setLoadingEnd', loaderMessage, {
    root: true,
  })
}
export function globalIsLoading(loaderMessage) {
  return store.getters['loading/isLoading'](loaderMessage)
}
export function globalAnyLoading() {
  return store.getters['loading/anyLoading']
}
