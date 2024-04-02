import { inject } from 'vue'
export const useConfigGlobal = () => {
  const configGlobal = inject('configGlobal', {})
  return {
    configGlobal
  }
}
//# sourceMappingURL=useConfigGlobal.js.map
