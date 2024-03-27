import { getParentLayout, Layout } from '@/utils/routerHelper'

export const systemRouter: AppRouteRecordRaw = {
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: '系统',
    icon: 'ant-design:dashboard-filled',
    role: ['ADMIN']
  },
  children: [
    {
      path: 'index',
      name: 'SystemIndex',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '模块设置'
      }
    },
    {
      path: 'workspace',
      name: 'SystemWorkspace',
      component: () => import('@/views/system/workspace.vue'),
      meta: {
        title: '作业地点'
      }
    },
    {
      path: 'flowable',
      name: 'SystemFlowable',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '流程'
      }
    },
    {
      path: 'user',
      name: 'SystemUser',
      component: () => getParentLayout(),
      meta: {
        title: '用户'
      },
      children: [
        {
          path: 'index',
          name: 'SystemUserIndex',
          component: () => import('@/views/empty.vue'),
          meta: {
            title: '列表'
          }
        },
        {
          path: 'group',
          name: 'SystemUserGroup',
          component: () => import('@/views/empty.vue'),
          meta: {
            title: '组别'
          }
        }
      ]
    }
  ]
}
