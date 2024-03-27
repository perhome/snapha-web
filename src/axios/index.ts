import service from './service'
import { CONTENT_TYPE } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'
import { InternalAxiosRequestConfig } from '@/axios/types'
import { AxiosError, AxiosRequestHeaders } from 'axios'

let isRefreshing = false
let requests: ReadonlyArray<(config: any) => void> = []

const request = (option: AxiosConfig) => {
  const { url, method, params, data, headers, responseType } = option
  return service.request({
    url: url,
    method,
    params,
    data: data,
    responseType: responseType,
    headers: {
      'Content-Type': CONTENT_TYPE,
      ...headers
    }
  })
}

const axiosInstance = service.getAxiosInstance()
axiosInstance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
  const userStore = useUserStoreWithOut()
  if (userStore.getAccessToken && !isRefreshing) {
    ;(res.headers as AxiosRequestHeaders)['Authorization'] = 'Bearer '.concat(
      userStore.getAccessToken
    )
  }
  return res
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      if (!('data' in error.response)) {
        return Promise.reject(error)
      }
      const response: any = error.response.data

      if (response.message.indexOf('expired') == -1) {
        const userStore = useUserStoreWithOut()
        userStore.logout()
        return Promise.reject(error)
      }

      try {
        if (!isRefreshing) {
          isRefreshing = true
          // 刷新token
          const accessToken = refreshToken()
          if (accessToken) {
            // service.defaults.headers.common.Authorization = `Bearer ${access_token}`
            requests.forEach((cb) => cb(accessToken))
            requests = []
            return service.request({
              ...error.config,
              headers: {
                ...(error.config?.headers || {}),
                Authorization: `Bearer ${accessToken}`
              }
            })
          }
          return Promise.reject(error)
        }
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests = [
            ...requests,
            (token) =>
              resolve(
                service.request({
                  ...error.config,
                  headers: {
                    ...(error.config?.headers || {}),
                    Authorization: `Bearer ${token}`
                  }
                })
              )
          ]
        })
      } catch (e) {
        isRefreshing = false
        return Promise.reject(error)
      } finally {
        if (!requests.length) {
          isRefreshing = false
        }
      }
    }
    return Promise.reject(error)
  }
)

async function refreshToken() {
  const userStore = useUserStoreWithOut()
  const refreshToken = userStore.getRefreshToken
  let accessToken = ''
  if (!refreshToken) {
    return accessToken
  }

  const ret: any = await service.request({
    method: 'post',
    url: '/api/v1/auth/refresh-token',
    headers: {
      'Content-Type': CONTENT_TYPE,
      Authorization: `Bearer ${refreshToken}`
    }
  })
  if (ret.status == 200) {
    const response = ret.data
    userStore.setAccessToken(response.data.access_token)
    userStore.setRefreshToken(response.data.refresh_token)
    accessToken = response.data.access_token
  }

  return accessToken
}

export default {
  get: <T = any>(option: AxiosConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },
  post: <T = any>(option: AxiosConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },
  delete: <T = any>(option: AxiosConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },
  put: <T = any>(option: AxiosConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  },
  cancelRequest: (url: string | string[]) => {
    return service.cancelRequest(url)
  },
  cancelAllRequest: () => {
    return service.cancelAllRequest()
  }
}
