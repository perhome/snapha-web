import request from '@/axios'
export const loginApi = (data) => {
  return request.post({ url: '/api/v1/auth/login', data })
}
export const loginOutApi = () => {
  return request.get({ url: '/api/v1/user/logout' })
}
export const getUserInfoApi = () => {
  return request.get({ url: '/api/v1/user/info' })
}
export const getUserRoleApi = () => {
  return request.get({ url: '/api/v1/user/info' })
}
//# sourceMappingURL=index.js.map
