import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress/nprogress'
import { getLocalStorage } from '@utils/localStorage'
import store from '@store'
import constantRoutes from './constant-routes'
import asyncRoutes from './async-routes'
import findUserRoute from '@utils/find-user-route'

const userRoutes = getLocalStorage("admin.auth.userRoutes") || [];
const generateValidateRoutes = (routes) => {
  return asyncRoutes.filter(({ name }) => Object.keys(findUserRoute(name, routes)).length)
}

const router = createRouter({
  routes: [...constantRoutes, ...generateValidateRoutes(userRoutes)],
  history: createWebHistory('/cms'),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  },
})

/* const router = new VueRouter({
  routes,
  base: "/checkin",
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if(savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
}); */

router.beforeEach(async (routeTo, routeFrom, next) => {
  if (routeTo.meta.isNullPage) {
    return next()
  } else {
    const startNProgress = () => {
      if (routeFrom.name !== null) {
        NProgress.start()
      }
    }

    const setScrollRestoration = () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = routeTo.meta.notScrollRestoration ? 'manual' : 'auto'
      }
    }

    const redirectToLogin = () => {
      const needRedirect = routeTo.name !== '404' && routeTo.name !== 'logout'
      // Pass the original route to the login component
      next({
        name: 'login',
        query: needRedirect
          ? {
              redirectFrom: routeTo.fullPath,
            }
          : '',
        replace: true,
      })
    }

    // Check if auth is required on this route
    // (including nested routes).
    const authRequired = routeTo.matched.some((route) => route.meta.authRequired)

    // If auth isn't required for the route, just continue.
    if (!authRequired) {
      return next()
    }
    if (store.getters['auth/loggedIn']) {
      return next()
    }

    startNProgress()
    setScrollRestoration()

    // If auth is required and the user is NOT currently logged in,
    // redirect to login.
    redirectToLogin()
  }
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            if (args.length) {
              if (routeFrom.name === args[0].name) {
                NProgress.done()
              }

              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    }
  } catch (error) {
    return
  }

  next()
})

router.afterEach((routeTo, routeFrom) => {
  NProgress.done()
})

export default router
