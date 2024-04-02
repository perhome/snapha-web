import router from '@/router'
import { getRawRoute } from '@/utils/routerHelper'
import { defineStore } from 'pinia'
import { store } from '@/store'
import { findIndex } from '@/utils'
import { useUserStoreWithOut } from './user'
export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    visitedViews: [],
    cachedViews: new Set(),
    selectedTag: undefined
  }),
  getters: {
    getVisitedViews() {
      return this.visitedViews
    },
    getCachedViews() {
      return Array.from(this.cachedViews)
    },
    getSelectedTag() {
      return this.selectedTag
    }
  },
  actions: {
    // 新增缓存和tag
    addView(view) {
      this.addVisitedView(view)
      this.addCachedView()
    },
    // 新增tag
    addVisitedView(view) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      if (view.meta?.noTagsView) return
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name'
        })
      )
    },
    // 新增缓存
    addCachedView() {
      const cacheMap = new Set()
      for (const v of this.visitedViews) {
        const item = getRawRoute(v)
        const needCache = !item?.meta?.noCache
        if (!needCache) {
          continue
        }
        const name = item.name
        cacheMap.add(name)
      }
      if (Array.from(this.cachedViews).sort().toString() === Array.from(cacheMap).sort().toString())
        return
      this.cachedViews = cacheMap
    },
    // 删除某个
    delView(view) {
      this.delVisitedView(view)
      this.addCachedView()
    },
    // 删除tag
    delVisitedView(view) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },
    // 删除缓存
    delCachedView() {
      const route = router.currentRoute.value
      const index = findIndex(this.getCachedViews, (v) => v === route.name)
      if (index > -1) {
        this.cachedViews.delete(this.getCachedViews[index])
      }
    },
    // 删除所有缓存和tag
    delAllViews() {
      this.delAllVisitedViews()
      this.addCachedView()
    },
    // 删除所有tag
    delAllVisitedViews() {
      const userStore = useUserStoreWithOut()
      // const affixTags = this.visitedViews.filter((tag) => tag.meta.affix)
      this.visitedViews = userStore.getUserInfo
        ? this.visitedViews.filter((tag) => tag?.meta?.affix)
        : []
    },
    // 删除其它
    delOthersViews(view) {
      this.delOthersVisitedViews(view)
      this.addCachedView()
    },
    // 删除其它tag
    delOthersVisitedViews(view) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v?.meta?.affix || v.path === view.path
      })
    },
    // 删除左侧
    delLeftViews(view) {
      const index = findIndex(this.visitedViews, (v) => v.path === view.path)
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.path === view.path || i > index
        })
        this.addCachedView()
      }
    },
    // 删除右侧
    delRightViews(view) {
      const index = findIndex(this.visitedViews, (v) => v.path === view.path)
      if (index > -1) {
        this.visitedViews = this.visitedViews.filter((v, i) => {
          return v?.meta?.affix || v.path === view.path || i < index
        })
        this.addCachedView()
      }
    },
    updateVisitedView(view) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    // 设置当前选中的tag
    setSelectedTag(tag) {
      this.selectedTag = tag
    },
    setTitle(title, path) {
      for (const v of this.visitedViews) {
        if (v.path === (path ?? this.selectedTag?.path)) {
          v.meta.title = title
          break
        }
      }
    }
  },
  persist: false
})
export const useTagsViewStoreWithOut = () => {
  return useTagsViewStore(store)
}
//# sourceMappingURL=tagsView.js.map
