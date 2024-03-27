import { Layout } from '@/utils/routerHelper'

export const warehouseRouter: AppRouteRecordRaw = {
  path: '/warehouse',
  component: Layout,
  redirect: '/warehouse/index',
  name: 'Warehouse',
  meta: {
    title: '库房',
    icon: 'ic:sharp-warehouse',
    role: ['ADMIN', 'MANAGER', 'WAREHOUSE']
  },
  children: [
    {
      path: 'product',
      component: () => import('@/views/empty.vue'),
      name: 'WarehouseProduct',
      meta: { title: '库存' }
    },
    {
      path: 'product/checkin',
      name: 'WarehouseProductCheckin',
      component: () => import('@/views/empty.vue'),
      meta: { title: '入库' }
    },
    {
      path: 'product/checkout',
      name: 'WarehouseProductCheckout',
      component: () => import('@/views/empty.vue'),
      meta: { title: '出库' }
    }
  ]
}
