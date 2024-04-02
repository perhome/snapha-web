import request from '@/axios'
export const getCountApi = () => {
  return request.get({ url: '/mock/analysis/total' })
}
export const getUserAccessSourceApi = () => {
  return request.get({ url: '/mock/analysis/userAccessSource' })
}
export const getWeeklyUserActivityApi = () => {
  return request.get({ url: '/mock/analysis/weeklyUserActivity' })
}
export const getMonthlySalesApi = () => {
  return request.get({ url: '/mock/analysis/monthlySales' })
}
//# sourceMappingURL=index.js.map
