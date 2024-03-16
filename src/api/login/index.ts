import request from '@/axios'
import type { UserType } from './types'
import { UserLoginType, AuthType } from './types'

export const loginApi = (data: UserLoginType): Promise<IResponse<AuthType>> => {
  return request.post({ url: '/api/v1/auth/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/api/v1/user/logout' })
}

export const getUserInfoApi = (): Promise<IResponse<UserType>> => {
  return request.get({ url: '/api/v1/user/info' })
}

export const getUserRoleApi = (): Promise<IResponse<UserType>> => {
  return request.get({ url: '/api/v1/user/info' })
}
