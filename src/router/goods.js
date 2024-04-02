import { Layout } from '@/utils/routerHelper'
export const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/index',
  name: 'Goods',
  meta: {
    title: '物资',
    role: ['ADMIN', 'MANAGER'],
    icon: 'carbon:skill-level-advanced'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/goods/index.vue'),
      name: 'GoodsIndex',
      meta: { title: '物资档案' }
    },
    {
      path: 'checkin',
      component: () => import('@/views/goods/checkin.vue'),
      name: 'GoodsCheckin',
      meta: { title: '入库物资' }
    },
    {
      path: 'checkin/add',
      component: () => import('@/views/empty.vue'),
      name: 'GoodsCheckinAdd',
      meta: { title: '入库', hidden: true, activeMenu: '/goods/checkin' }
    },
    {
      path: 'category',
      component: () => import('@/views/goods/category.vue'),
      name: 'GoodsCategory',
      meta: { title: '物资分类' }
    },
    {
      path: 'alloted',
      name: 'GoodsAlloted',
      meta: { title: '已领料物资' },
      component: () => import('@/views/empty.vue')
    }
  ]
}
//# sourceMappingURL=goods.js.map
