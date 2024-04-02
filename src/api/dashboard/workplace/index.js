import request from '@/axios'
export const getCountApi = () => {
  return request.get({ url: '/mock/workplace/total' })
}
export const getProjectApi = () => {
  return request.get({ url: '/mock/workplace/project' })
}
export const getDynamicApi = () => {
  return request.get({ url: '/mock/workplace/dynamic' })
}
export const getTeamApi = () => {
  return request.get({ url: '/mock/workplace/team' })
}
export const getRadarApi = () => {
  return request.get({ url: '/mock/workplace/radar' })
}
//# sourceMappingURL=index.js.map
