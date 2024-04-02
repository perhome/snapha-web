import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/utils/routerHelper'
import { store } from '@/store'
import { cloneDeep } from 'lodash-es'
export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters() {
      return this.routers
    },
    getAddRouters() {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters() {
      return this.isAddRouters
    },
    getMenuTabRouters() {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(type, routers) {
      return new Promise((resolve) => {
        let routerMap = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers)
        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers)
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state) {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers) {
      this.menuTabRouters = routers
    }
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters']
  }
})
export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
//# sourceMappingURL=permission.js.map
