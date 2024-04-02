import { defineStore } from 'pinia'
import { store } from '../index'
import { setCssVar, humpToUnderline } from '@/utils'
import { colorIsDark, hexToRGB, lighten, mix } from '@/utils/color'
import { ElMessage } from 'element-plus'
import { useCssVar } from '@vueuse/core'
import { unref } from 'vue'
import { useDark } from '@vueuse/core'
export const useAppStore = defineStore('app', {
  state: () => {
    return {
      showSetting: false,
      sizeMap: ['default', 'large', 'small'],
      mobile: false, // 是否是移动端
      title: import.meta.env.VITE_APP_TITLE, // 标题
      pageLoading: false, // 路由跳转loading
      breadcrumb: true, // 面包屑
      breadcrumbIcon: true, // 面包屑图标
      collapse: false, // 折叠菜单
      uniqueOpened: false, // 是否只保持一个子菜单的展开
      hamburger: true, // 折叠图标
      screenfull: true, // 全屏图标
      size: true, // 尺寸图标
      locale: true, // 多语言图标
      tagsView: true, // 标签页
      tagsViewIcon: true, // 是否显示标签图标
      logo: true, // logo
      fixedHeader: true, // 固定toolheader
      footer: true, // 显示页脚
      greyMode: false, // 是否开始灰色模式，用于特殊悼念日
      dynamicRouter: true, // 是否动态路由
      serverDynamicRouter: false, // 是否服务端渲染动态路由
      fixedMenu: false, // 是否固定菜单
      layout: 'classic', // layout布局
      isDark: false, // 是否是暗黑模式
      currentSize: 'default', // 组件尺寸
      theme: {
        // 主题色
        elColorPrimary: '#409eff',
        // 左侧菜单边框颜色
        leftMenuBorderColor: 'inherit',
        // 左侧菜单背景颜色
        leftMenuBgColor: '#001529',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '#0f2438',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        // 左侧菜单字体颜色
        leftMenuTextColor: '#bfcbd9',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '#fff',
        // logo字体颜色
        logoTitleTextColor: '#fff',
        // logo边框颜色
        logoBorderColor: 'inherit',
        // 头部背景颜色
        topHeaderBgColor: '#fff',
        // 头部字体颜色
        topHeaderTextColor: 'inherit',
        // 头部悬停颜色
        topHeaderHoverColor: '#f6f6f6',
        // 头部边框颜色
        topToolBorderColor: '#eee'
      }
    }
  },
  getters: {
    getShowSetting() {
      return this.showSetting
    },
    getBreadcrumb() {
      return this.breadcrumb
    },
    getBreadcrumbIcon() {
      return this.breadcrumbIcon
    },
    getCollapse() {
      return this.collapse
    },
    getUniqueOpened() {
      return this.uniqueOpened
    },
    getHamburger() {
      return this.hamburger
    },
    getScreenfull() {
      return this.screenfull
    },
    getSize() {
      return this.size
    },
    getLocale() {
      return this.locale
    },
    getTagsView() {
      return this.tagsView
    },
    getTagsViewIcon() {
      return this.tagsViewIcon
    },
    getLogo() {
      return this.logo
    },
    getFixedHeader() {
      return this.fixedHeader
    },
    getGreyMode() {
      return this.greyMode
    },
    getDynamicRouter() {
      return this.dynamicRouter
    },
    getServerDynamicRouter() {
      return this.serverDynamicRouter
    },
    getFixedMenu() {
      return this.fixedMenu
    },
    getPageLoading() {
      return this.pageLoading
    },
    getLayout() {
      return this.layout
    },
    getTitle() {
      return this.title
    },
    getIsDark() {
      return this.isDark
    },
    getCurrentSize() {
      return this.currentSize
    },
    getSizeMap() {
      return this.sizeMap
    },
    getMobile() {
      return this.mobile
    },
    getTheme() {
      return this.theme
    },
    getFooter() {
      return this.footer
    }
  },
  actions: {
    setShowSetting(showSetting) {
      this.showSetting = showSetting
    },
    setBreadcrumb(breadcrumb) {
      this.breadcrumb = breadcrumb
    },
    setBreadcrumbIcon(breadcrumbIcon) {
      this.breadcrumbIcon = breadcrumbIcon
    },
    setCollapse(collapse) {
      this.collapse = collapse
    },
    setUniqueOpened(uniqueOpened) {
      this.uniqueOpened = uniqueOpened
    },
    setHamburger(hamburger) {
      this.hamburger = hamburger
    },
    setScreenfull(screenfull) {
      this.screenfull = screenfull
    },
    setSize(size) {
      this.size = size
    },
    setLocale(locale) {
      this.locale = locale
    },
    setTagsView(tagsView) {
      this.tagsView = tagsView
    },
    setTagsViewIcon(tagsViewIcon) {
      this.tagsViewIcon = tagsViewIcon
    },
    setLogo(logo) {
      this.logo = logo
    },
    setFixedHeader(fixedHeader) {
      this.fixedHeader = fixedHeader
    },
    setGreyMode(greyMode) {
      this.greyMode = greyMode
    },
    setDynamicRouter(dynamicRouter) {
      this.dynamicRouter = dynamicRouter
    },
    setServerDynamicRouter(serverDynamicRouter) {
      this.serverDynamicRouter = serverDynamicRouter
    },
    setFixedMenu(fixedMenu) {
      this.fixedMenu = fixedMenu
    },
    setPageLoading(pageLoading) {
      this.pageLoading = pageLoading
    },
    setLayout(layout) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其它布局')
        return
      }
      this.layout = layout
    },
    setTitle(title) {
      this.title = title
    },
    setIsDark(isDark) {
      this.isDark = isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      this.setPrimaryLight()
    },
    setCurrentSize(currentSize) {
      this.currentSize = currentSize
    },
    setMobile(mobile) {
      this.mobile = mobile
    },
    setTheme(theme) {
      this.theme = Object.assign(this.theme, theme)
    },
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key])
      }
      this.setPrimaryLight()
    },
    setFooter(footer) {
      this.footer = footer
    },
    setPrimaryLight() {
      if (this.theme.elColorPrimary) {
        const elColorPrimary = this.theme.elColorPrimary
        const color = this.isDark ? '#000000' : '#ffffff'
        const lightList = [3, 5, 7, 8, 9]
        lightList.forEach((v) => {
          setCssVar(`--el-color-primary-light-${v}`, mix(color, elColorPrimary, v / 10))
        })
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2))
      }
    },
    setMenuTheme(color) {
      const primaryColor = useCssVar('--el-color-primary', document.documentElement)
      const isDarkColor = colorIsDark(color)
      const theme = {
        // 左侧菜单边框颜色
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
        // 左侧菜单背景颜色
        leftMenuBgColor: color,
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: isDarkColor ? lighten(color, 6) : color,
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 左侧菜单字体颜色
        leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: isDarkColor ? '#fff' : 'var(--el-color-primary)',
        // logo字体颜色
        logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
        // logo边框颜色
        logoBorderColor: isDarkColor ? color : '#eee'
      }
      this.setTheme(theme)
      this.setCssVarTheme()
    },
    setHeaderTheme(color) {
      const isDarkColor = colorIsDark(color)
      const textColor = isDarkColor ? '#fff' : 'inherit'
      const textHoverColor = isDarkColor ? lighten(color, 6) : '#f6f6f6'
      const topToolBorderColor = isDarkColor ? color : '#eee'
      setCssVar('--top-header-bg-color', color)
      setCssVar('--top-header-text-color', textColor)
      setCssVar('--top-header-hover-color', textHoverColor)
      this.setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor
      })
      if (this.getLayout === 'top') {
        this.setMenuTheme(color)
      }
    },
    initTheme() {
      const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light'
      })
      isDark.value = this.getIsDark
    }
  },
  persist: true
})
export const useAppStoreWithOut = () => {
  return useAppStore(store)
}
//# sourceMappingURL=app.js.map
