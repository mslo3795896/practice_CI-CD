import '@styles/index.scss'

import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'

import App from './App.vue'
import router from '@router'
import i18n from '@lang'
import store from '@store'

import registerGlobalComponents from '@components/_globals'

import antd from '@plugins/antd'

import '@utils/development'

window.require = (name) => new URL(name, import.meta.url).href
const metaManager = createMetaManager(false, { keyName: 'page' })

const app = createApp(App)
  .use(router)
  .use(store)
  .use(metaManager)
  .use(i18n)
  .use(antd)

registerGlobalComponents(app)

if (import.meta.env.MODE === 'development' || window.globalData.APP_ENV === 'local' || window.globalData.APP_ENV === 'staging') {
  app.config.globalProperties.IS_DEVELOPMENT = true
}

if (window.globalData.APP_ENV === 'production') {
  app.config.globalProperties.IS_OFFICIAL = true
}

/* // If running e2e tests...
if(import.meta.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  window.__app__ = app
} */

app.mount('#app')
export default app
