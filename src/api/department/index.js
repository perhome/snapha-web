import request from '@/axios'
export const getDepartmentApi = () => {
  return request.get({ url: '/mock/department/list' })
}
export const getUserByIdApi = (params) => {
  return request.get({ url: '/mock/department/users', params })
}
export const deleteUserByIdApi = (ids) => {
  return request.post({ url: '/mock/department/user/delete', data: { ids } })
}
export const saveUserApi = (data) => {
  return request.post({ url: '/mock/department/user/save', data })
}
export const saveDepartmentApi = (data) => {
  return request.post({ url: '/mock/department/save', data })
}
export const deleteDepartmentApi = (ids) => {
  return request.post({ url: '/mock/department/delete', data: { ids } })
}
export const getDepartmentTableApi = (params) => {
  return request.get({ url: '/mock/department/table/list', params })
}
//# sourceMappingURL=index.js.map
