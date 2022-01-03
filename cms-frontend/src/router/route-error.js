import store from '@store'
import { Trans } from "@utils/translation";
import router from '@router'

export default function routeError(error, routeTo, callback) {
  console.log('TCL: Route -> error', error);

  if(error.code === 405 || error.code === 401) {

    store.dispatch('auth/logOut')
      .then(() => {
        router.push({
          name: 'login',
          query: {
            redirectFrom: routeTo.path
          },
          params: {
            lang: Trans.getUserSupportedLang()
          }
        })
      });
  } else {
    return callback
  }
}
