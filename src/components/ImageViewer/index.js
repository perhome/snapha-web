import ImageViewer from './src/ImageViewer.vue'
import { isClient } from '@/utils/is'
import { createVNode, render } from 'vue'
let instance = null
export function createImageViewer(options) {
  if (!isClient) return
  const {
    urlList,
    initialIndex = 0,
    infinite = true,
    hideOnClickModal = false,
    teleported = false,
    zIndex = 2000,
    show = true
  } = options
  const propsData = {}
  const container = document.createElement('div')
  propsData.urlList = urlList
  propsData.initialIndex = initialIndex
  propsData.infinite = infinite
  propsData.hideOnClickModal = hideOnClickModal
  propsData.teleported = teleported
  propsData.zIndex = zIndex
  propsData.show = show
  document.body.appendChild(container)
  instance = createVNode(ImageViewer, propsData)
  render(instance, container)
}
//# sourceMappingURL=index.js.map
