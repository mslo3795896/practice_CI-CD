export default function findRoute(routeTitle = '', routes = []) {
  let result = {}
  const deepFindRoute = (route, parent) => {
    if (route.title === routeTitle || route.name === routeTitle) {
      result = {
        ...route,
        parent,
        pageGroupId: parent.id,
        pageId: route.id,
      }
      return true
    }
    if (route.assets) route.assets.some((item) => deepFindRoute(item, route))
    else route.children && route.children.some((item) => deepFindRoute(item, route))

    return false
  }
  routes.some((route) => deepFindRoute(route))
  return result
}
