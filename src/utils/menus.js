import { getRequest } from './api'

export const initMenu = (router, store) => {
  //store存在，正常跳转
  if (store.state.routes.length > 0) {
    return
  }
  //store不存在，需要初始化菜单数据
  //访问后端，获取菜单json数据，通过formatRoutes将json数据转为组件
  getRequest('/system/config/menu').then((data) => {
    if (data) {
      let fmtRoutes = formatRoutes(data)
      router.addRoutes(fmtRoutes) //动态添加路由
      store.commit('initRoutes', fmtRoutes) //将数据保存在store中
      store.dispatch('connect')
    }
  })
}
export const formatRoutes = (routes) => {
  let fmRoutes = []
  //遍历数组，对象解构，转化为component
  routes.forEach((router) => {
    let { path, component, name, meta, iconCls, children } = router
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    let fmRouter = {
      path: path,
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children,
      component(resolve) {
        if (component.startsWith('Home')) {
          require(['../views/' + component + '.vue'], resolve)
        } else if (component.startsWith('Emp')) {
          require(['../views/emp/' + component + '.vue'], resolve)
        } else if (component.startsWith('Per')) {
          require(['../views/per/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sal')) {
          require(['../views/sal/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sta')) {
          require(['../views/sta/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sys')) {
          require(['../views/sys/' + component + '.vue'], resolve)
        } else if (component.startsWith('Study')) {
          // 动态加载组件
          require(['../views/study/' + component + '.vue'], resolve)
        } else if (component.startsWith('Map')) {
          // 动态加载组件
          require(['../views/map/' + component + '.vue'], resolve)
        } else if (component.startsWith('Three')) {
          require(['../views/three/' + component + '.vue'], resolve)
        }
      },
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}
