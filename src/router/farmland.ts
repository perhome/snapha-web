import { Layout } from '@/utils/routerHelper'

export const farmlandRouter: AppRouteRecordRaw = {
  path: '/farmland',
  component: Layout,
  name: 'FarmLand',
  meta: {
    title: '农田管理',
    icon: 'ant-design:dashboard-filled',
    role: ['MANAGER']
  },
  children: [
    {
      path: 'index',
      name: 'FarmLandIndex',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '农田区块'
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
      path: 'cfr-product/yield',
      name: 'FarmlandCfrProductYield',
      component: () => import('@/views/empty.vue'),
      meta: {
        breadcrumb: true,
        title: '下菜单记录'
      }
    }
  ]
}
