import store from '@store'

export default function loading(app) {
  app.config.globalProperties.$startLoading = (loaderMessage) => {
    store.dispatch('loading/setLoadingStart', loaderMessage, {
      root: true,
    })
  }
  app.config.globalProperties.$endLoading = function(loaderMessage) {
    store.dispatch('loading/setLoadingEnd', loaderMessage, {
      root: true,
    })
  }
  app.config.globalProperties.$isLoading = function(loaderMessage) {
    return store.getters['loading/isLoading'](loaderMessage)
  }
  app.config.globalProperties.$anyLoading = function() {
    return store.getters['loading/anyLoading']
  }
}
