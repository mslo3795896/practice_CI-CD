import routeError from './route-error'
import store from '@store/index'

export default [
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/home',
    name: 'home',
    redirect: 'quick',
  },
  // 登入
  {
    path: '/login',
    name: 'login',
    // component: () => lazyLoadView(import('@views/Login/Index.vue')),
    // component: () => defineAsyncComponent(() => import('@views/Login/Index.vue')),
    component: () => import('@views/Login/Index.vue'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the user default redirect page instead
          next({
            name: 'home',
          })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  // Style Guide
  {
    path: '/style-guide',
    name: 'style-guide',
    component: () => import('@views/StyleGuide/Index.vue'),
  },
  // 404
  {
    path: '/404',
    name: '404',
    component: () => import('@views/_404.vue'),
    meta: {
      showBreadcrumb: false,
    },
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
]
