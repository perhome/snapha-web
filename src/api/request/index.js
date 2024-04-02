import request from '@/axios'
export const request1 = () => {
  return request.get({
    url: '/mock/request/1'
  })
}
export const request2 = () => {
  return request.get({
    url: '/mock/request/2'
  })
}
export const request3 = () => {
  return request.get({
    url: '/mock/request/3'
  })
}
export const request4 = () => {
  return request.get({
    url: '/mock/request/4'
  })
}
export const request5 = () => {
  return request.get({
    url: '/mock/request/5'
  })
}
export const expired = () => {
  return request.get({
    url: '/mock/request/expired'
  })
}
//# sourceMappingURL=index.js.map
