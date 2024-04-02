import { defineStore } from 'pinia'
import { store } from '@/store'
import { ElMessageBox } from 'element-plus'
import { loginOutApi } from '@/api/login'
import { useTagsViewStore } from './tagsView'
import router from '@/router'
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: undefined,
      tokenKey: 'Authorization',
      accessToken: '',
      refreshToken: '',
      roleRouters: undefined,
      // 记住我
      rememberMe: true,
      loginInfo: undefined
    }
  },
  getters: {
    getTokenKey() {
      return this.tokenKey
    },
    getAccessToken() {
      return this.accessToken
    },
    getRefreshToken() {
      return this.refreshToken
    },
    getUserInfo() {
      return this.userInfo
    },
    getRoleRouters() {
      return this.roleRouters
    },
    getRememberMe() {
      return this.rememberMe
    },
    getLoginInfo() {
      return this.loginInfo
    }
  },
  actions: {
    setTokenKey(tokenKey) {
      this.tokenKey = tokenKey
    },
    setAccessToken(token) {
      this.accessToken = token
    },
    setRefreshToken(token) {
      this.refreshToken = token
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    setRoleRouters(roleRouters) {
      this.roleRouters = roleRouters
    },
    logoutConfirm() {
      ElMessageBox.confirm('注销', '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await loginOutApi().catch(() => {})
          if (res) {
            this.reset()
          }
        })
        .catch(() => {})
    },
    reset() {
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.delAllViews()
      this.setAccessToken('')
      this.setRefreshToken('')
      this.setUserInfo(undefined)
      this.setRoleRouters([])
      router.replace('/login')
    },
    logout() {
      this.reset()
    },
    setRememberMe(rememberMe) {
      this.rememberMe = rememberMe
    },
    setLoginInfo(loginInfo) {
      this.loginInfo = loginInfo
    }
  },
  persist: true
})
export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
//# sourceMappingURL=user.js.map
