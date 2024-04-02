import request from '@/axios'
export const getTableListApi = (params) => {
  return request.get({ url: '/mock/example/list', params })
}
export const getCardTableListApi = (params) => {
  return request.get({ url: '/mock/card/list', params })
}
export const getTreeTableListApi = (params) => {
  return request.get({ url: '/mock/example/treeList', params })
}
export const saveTableApi = (data) => {
  return request.post({ url: '/mock/example/save', data })
}
export const getTableDetApi = (id) => {
  return request.get({ url: '/mock/example/detail', params: { id } })
}
export const delTableListApi = (ids) => {
  return request.post({ url: '/mock/example/delete', data: { ids } })
}
//# sourceMappingURL=index.js.map
