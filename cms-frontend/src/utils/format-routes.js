export default function formatRoutes(routers, root = false, parentId = undefined) {
  //簡單檢查是否是可以處理的數據
  if (!(routers instanceof Array)) {
    return false
  }
  //處理後的容器
  let fmRouters = []
  routers.forEach((router) => {
    // 取得 router 內變數
    let {
      path,
      full_path, // 要註意，以 / 開頭的嵌套路徑會被當作根路徑。 這讓你充分的使用嵌套組件而無須設置嵌套的路徑。
      component,
      title,
      redirect,
      assets,
      icon,
      showNav,
      type,
      id,
      edit,
      apis,
      visible,
    } = router

    const hasChildren = (menu) => {
      if (menu.type !== 'alias') return true
      return menu.assets.some(({ visible }) => visible)
    }

    if (visible && hasChildren(router)) {
    //   component = component ? component : 'layout'
      //如果有子組件，遞歸處理
      if (assets && assets instanceof Array) {
        assets = formatRoutes(assets, false, id)
      }
      let fmRouter = {
        path: full_path || path,
        /* component: () => {
                    //拚出相對路徑，由於component無法識別變量
                    //利用Webpack 的 Code-Splitting 功能
                    return component === "layout"
                        ? import("layout/index")
                        : import("views/" + component);
                }, */
        name: title,
        children: assets,
        meta: {
          icon,
          showNav,
          type,
          id,
          parentId: parentId || id, // 控制台沒有 parent
        },
      }
      if (redirect) {
        fmRouter.redirect = redirect
      }
      fmRouters.push(fmRouter)

      // 後端不再回傳編輯頁路由，改由前端自行生成；權限部分繼承自 list 頁
      if (component.includes('list') && edit !== false) {
        const editRouter = {
          path: path + '/edit',
          // component: () => import("views/" + component.replace('list', 'edit')),
          name: 'EDIT-' + title,
          meta: {
            icon,
            showNav: 0,
            type: 'function',
            id,
            parentId: parentId || id,
          },
        }
        fmRouters.push(editRouter)
      }
    }
  })
  // console.log(fmRouters)

  /* if (root)
    return [
      ...fmRouters,
      {
        path: '/',
        component: () => import('layout/index'),
        name: 'home',
        meta: {
          showNav: 0,
        },
      },
      {
        path: '*',
        redirect: '/error/404',
        enabled: 1,
        meta: {
          showNav: 0,
        },
      },
    ]
  else return fmRouters */

  return fmRouters
}
