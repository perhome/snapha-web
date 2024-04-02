import { Layout } from '@/utils/routerHelper'
export const iotRouter = {
  path: '/iot',
  component: Layout,
  redirect: '/iot/index',
  name: 'Iot',
  meta: {
    title: '物联网',
    icon: 'ic:sharp-warehouse',
    role: ['ADMIN', 'MANAGER']
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/empty.vue'),
      name: 'IotIndex',
      meta: { title: '数据源' }
    },
    {
      path: 'data',
      name: 'IotData',
      component: () => import('@/views/empty.vue'),
      meta: { title: '数据历史' }
    }
  ]
}
//# sourceMappingURL=iot.js.map
