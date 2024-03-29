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
      component: () => import('@/views/system/index.vue'),
      meta: {
        title: '全局设置'
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
      path: 'log',
      name: 'SystemLog',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '操作日志'
      }
    },
    {
      path: 'user',
      name: 'SystemUser',
      component: () => getParentLayout(),
      redirect: '/system/user/index',
      meta: {
        title: '用户'
      },
      children: [
        {
          path: 'index',
          name: 'SystemUserIndex',
          component: () => import('@/views/system/user/index.vue'),
          meta: {
            title: '员工'
          }
        },
        {
          path: 'create',
          name: 'SystemUserCreate',
          component: () => import('@/views/system/user/create.vue'),
          meta: {
            title: '新建用户',
            noTagsView: true,
            noCache: true,
            hidden: true,
            canTo: true,
            activeMenu: '/system/user/index'
          }
        },
        {
          path: 'group',
          name: 'SystemUserGroup',
          component: () => import('@/views/system/user/group.vue'),
          meta: {
            title: '组别'
          }
        }
      ]
    }
  ]
}
