import { Layout } from '@/utils/routerHelper'

export const shopRouter: AppRouteRecordRaw = {
  path: '/shop',
  component: Layout,
  redirect: '/shop/index',
  name: 'Shop',
  meta: {
    title: '销售',
    icon: 'ic:sharp-warehouse',
    role: ['ADMIN', 'MANAGER']
  },
  children: [
    {
      path: 'goods',
      component: () => import('@/views/empty.vue'),
      name: 'ShopGoods',
      meta: { title: '在售' }
    },
    {
      path: 'data',
      name: 'ShopOrder',
      component: () => import('@/views/empty.vue'),
      meta: { title: '已售' }
    }
  ]
}
