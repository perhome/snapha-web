import { getParentLayout, Layout } from '@/utils/routerHelper'
export const systemRouter = {
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
      path: 'department',
      name: 'SystemDepartment',
      component: () => import('@/views/system/department.vue'),
      meta: {
        title: '部门设置',
        hidden: true,
        canTo: true,
        activeMenu: '/system/index'
      }
    },
    {
      path: 'job',
      name: 'SystemJob',
      component: () => import('@/views/system/job.vue'),
      meta: {
        title: '岗位设置',
        hidden: true,
        canTo: true,
        activeMenu: '/system/index'
      }
    },
    {
      path: 'unit',
      name: 'SystemUnit',
      component: () => import('@/views/system/unit.vue'),
      meta: {
        title: '单位',
        hidden: true,
        canTo: true,
        activeMenu: '/system/index'
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
    },
    {
      path: 'product',
      name: 'SystemProduct',
      component: () => getParentLayout(),
      redirect: '/system/product/index',
      meta: {
        title: '产品'
      },
      children: [
        {
          path: 'index',
          name: 'SystemProductIndex',
          component: () => import('@/views/system/product/index.vue'),
          meta: {
            title: '产品'
          }
        },
        {
          path: 'category',
          name: 'SystemProductCategory',
          component: () => import('@/views/system/product/category.vue'),
          meta: {
            title: '类别'
          }
        }
      ]
    }
  ]
}
//# sourceMappingURL=system.js.map
