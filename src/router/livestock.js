import { Layout } from '@/utils/routerHelper'
export const livestockRouter = {
  path: '/livestock',
  component: Layout,
  name: 'Livestock',
  meta: {
    title: '养殖',
    icon: 'ant-design:dashboard-filled',
    role: ['ADMIN', 'LIVESTOCK']
  },
  children: [
    {
      path: 'index',
      name: 'LivestockIndex',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '档案'
      }
    },
    {
      path: 'inout',
      name: 'LivestockInout',
      component: () => import('@/views/empty.vue'),
      meta: {
        breadcrumb: true,
        title: '出入记录'
      }
    },
    {
      path: 'feeding',
      name: 'LivestockFeeding',
      component: () => import('@/views/empty.vue'),
      meta: {
        breadcrumb: true,
        title: '饲喂'
      }
    },
    {
      path: 'event-type',
      name: 'LivestockEventType',
      component: () => import('@/views/empty.vue'),
      meta: {
        title: '出入事件'
      }
    }
  ]
}
//# sourceMappingURL=livestock.js.map
