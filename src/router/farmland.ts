import { Layout } from '@/utils/routerHelper'

export const farmlandRouter: AppRouteRecordRaw = {
  path: '/farmland',
  component: Layout,
  name: 'FarmLand',
  children: [
    {
      path: 'index',
      name: 'FarmLandIndex',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '农田管理'
      }
    },
    {
      path: 'cfr-workspace',
      name: 'FarmLandCFRWorkspace',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '茬口轮作'
      }
    },
    {
      path: 'cfr-product/output',
      name: 'FarmlandCfrProductOutput',
      component: () => import('@/views/empty.vue'),
      meta: {
        hidden: true,
        breadcrumb: true,
        activeMenu: '/farmland/index',
        title: '下菜单记录'
      }
    }
  ],
  meta: {
    roles: ['FARMLAND']
  }
}
