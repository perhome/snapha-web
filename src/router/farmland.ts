import { Layout } from '@/utils/routerHelper'

export const farmlandRouter: AppRouteRecordRaw = {
  path: '/farmland',
  component: Layout,
  name: 'FarmLand',
  redirect: '/farmland/index',
  meta: {
    title: '种植',
    icon: 'ant-design:dashboard-filled',
    role: ['ADMIN', 'FARMLAND']
  },
  children: [
    {
      path: 'index',
      name: 'FarmLandIndex',
      component: () => import('@/views/farmland/index.vue'),
      meta: {
        title: '导航页'
      }
    },
    {
      path: 'cfr-workspace',
      name: 'FarmLandCfrWorkspace',
      component: () => import('@/views/farmland/cfr-workspace.vue'),
      meta: {
        title: '茬口轮作'
      }
    },
    {
      path: 'cfr/create',
      name: 'FarmLandCfrCreate',
      component: () => import('@/views/farmland/cfr-create.vue'),
      meta: {
        title: '新建茬口',
        noCache: false,
        hidden: true,
        canTo: true,
        activeMenu: '/farmland/cfr-workspace'
      }
    },
    {
      path: 'cfr-task',
      name: 'FarmLandCfrTask',
      component: () => import('@/views/farmland/task-create.vue'),
      meta: {
        title: '派工单'
      }
    },
    {
      path: 'cfr-workspace/yield',
      name: 'FarmlandCfrWorkspaceYield',
      component: () => import('@/views/empty.vue'),
      meta: {
        breadcrumb: true,
        title: '下菜单'
      }
    },
    {
      path: 'cfr-workspace/yield-nextday',
      name: 'FarmlandCfrWorkspaceYieldNextDay',
      component: () => import('@/views/empty.vue'),
      meta: {
        breadcrumb: true,
        title: '预估菜'
      }
    },
    {
      path: 'workstage',
      name: 'FarmLandWorkstage',
      component: () => import('@/views/farmland/workstage.vue'),
      meta: {
        title: '工序'
      }
    }
  ]
}
