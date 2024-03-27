import { Layout } from '@/utils/routerHelper'

export const workspaceRouter: AppRouteRecordRaw = {
  path: '/workspace',
  component: Layout,
  name: 'Workspace',
  meta: {
    title: '区块',
    icon: 'ant-design:dashboard-filled',
    role: ['ADMIN']
  },
  children: [
    {
      path: 'index',
      name: 'WorkspaceIndex',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '列表'
      }
    }
  ]
}
