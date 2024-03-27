import { Layout } from '@/utils/routerHelper'

export const goodsRouter: AppRouteRecordRaw = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/index',
  name: 'Goods',
  meta: {
    title: '物资',
    role: ['MANAGER'],
    icon: 'carbon:skill-level-advanced'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/empty.vue'),
      name: 'GoodsIndex',
      meta: { title: '物资档案' }
    },
    {
      path: 'map/:goodsId(\\d+)',
      component: () => import('@/views/empty.vue'),
      name: 'GoodsMap',
      meta: { title: '物料关系映射', hidden: true, activeMenu: '/goods/index' }
    },
    {
      path: 'checkin',
      component: () => import('@/views/empty.vue'),
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
      component: () => import('@/views/empty.vue'),
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
