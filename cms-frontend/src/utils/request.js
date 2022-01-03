import axios from 'axios'
import configRequest from '@src/config/request'
import formatErrorMessage from './format-response-message'
import { messageError } from '@utils/message'
import findUserRoute from '@utils/find-user-route'
import { globalIsLoading, globalStartLoading, globalEndLoading } from '@utils/setup/global-loading'

// import { MessageBox } from 'element-ui';
import router from '@router/index'
import store from '@store/index'
import { Trans } from '@utils/translation'

import { Modal } from 'ant-design-vue'

const baseURL = configRequest.baseURL

axios.defaults.baseURL = baseURL

console.log('INIT_API_PATH:', axios.defaults.baseURL)

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(
  (config) => {
    const configName = config?.name || 'api'
    const isThrottle = config?.isThrottle || false

    const attachPermissionId = () => {
      const { pageGroupId, pageId } = findUserRoute('COM_FRONT_DESK_MANAGER_TITLE', store.state.auth.userRoutes) // 報到後台的權限只判斷這個
      // route

      // GET
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          pageGroupId,
          pageId,
        }
      }

      // POST
      config.transformRequest = [
        function(data) {
          if (!data) {
            return data
          }

          // upload file
          if (data instanceof FormData) {
            data.append('pageGroupId', pageGroupId)
            data.append('pageId', pageId)
            return data
          }

          return {
            ...data,
            pageGroupId,
            pageId,
          }
        },
        ...axios.defaults.transformRequest,
      ]
    }
    if (globalIsLoading(configName) && isThrottle) {
      return Promise.reject({
        config,
        response: {
          data: {
            code: 200,
            message: 'Api Throttle',
            status: 'API_THROTTLE',
            data: null,
          },
        },
      })
    }

    globalStartLoading(configName)

    if (axios.defaults.baseURL !== config?.baseURL || baseURL) {
      axios.defaults.baseURL = config?.baseURL || baseURL
    }

    attachPermissionId()

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use((response) => {
  setTimeout(() => {
    globalEndLoading(response.config.name || 'api')
  }, response.config.endLoadingDelay || 0)
  // return Promise.reject(response)
  return response.data?.data || response.data
}, errorResponseHandler)

function errorResponseHandler(error) {
  const { config, response } = error

  globalEndLoading(config?.name || 'api')

  if (response && response.data.status !== 'API_THROTTLE') {
    if (!config.errorHandle) {
      return response.data
    }

    if (config.showMessage) {
      if (response.data.status === 'INPUT_INVALID') {
        const content = () => {
          const level1 = Object.keys(response.data.data)

          let level1Content = ''

          level1.forEach((level1Key) => {
            const level2 = response.data.data[level1Key]

            const level2Content = () => {
              let level2Content = ''

              if (level2.length > 0) {
                level2.forEach((level2Text) => {
                  level2Content += `<li>${level2Text}</li>`
                })

                return `<ul>${level2Content}</ul>`
              } else {
                return ''
              }
            }

            level1Content += `<li>${level1Key}${level2Content()}</li>`
          })

          return `<ol>${level1Content}</ol>`
        }

        /* MessageBox.alert(content(), '欄位錯誤', {
          customClass: 'isStyleError',
          confirmButtonText: '確定',
          dangerouslyUseHTMLString: true
        }) */
        Modal.warning({
          title: '欄位錯誤',
          content: content(),
          okText: '確定',
        })
      } else {
        messageError({
          content: response.data?.message,
          duration: 3,
        })
      }
    }

    if ((config.logoutRedirect && response.data.code === 405) || response.data.code === 401) {
      /* router.replace({
       name: 'logout',
       query: {
       redirectFrom: location.pathname
       }
       }) */
      store.dispatch('auth/logOut').then(() => {
        // window.location = `/checkin/login?redirectFrom=${ location.pathname }`;

        window.location = router.resolve({
          name: 'login',
          query: {
            redirectFrom: location.pathname,
          },
        }).href
      })
    }

    return Promise.reject(response.data)
  } else if (!window.navigator.onLine) {
    messageError('網路出了點問題，請重新連線後刷新頁面')
  } else {
    return Promise.reject(error)
  }
}

export default axios
