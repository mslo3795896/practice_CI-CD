import store from '@store/index'

export default [
  // SLIDESHOW
  {
    path: '/home/slideshow',
    name: 'COM_SLIDESHOW_MANAGER_TITLE',
    component: () => import('@views/Home/slideshow/list.vue'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        next()
      },
    },
  },
  // SLIDESHOW-EDIT
  {
    path: '/home/slideshow/edit',
    name: 'EDIT-COM_SLIDESHOW_MANAGER_TITLE',
    component: () => import('@views/Home/slideshow/edit.vue'),
  },

  // Brands
  {
    path: '/brands/manager',
    name: 'COM_BRANDS_MANAGER_TITLE',
    component: () => import('@views/Brands/manager/list.vue'),
  },
  // Brands-EDIT
  {
    path: '/brands/manager/edit',
    name: 'EDIT-COM_BRANDS_MANAGER_TITLE',
    component: () => import('@views/Brands/manager/edit.vue'),
  },
]
