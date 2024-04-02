import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'
export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta) => {
    const { t } = useI18n()
    const { title = 'Please set title', icon } = meta
    return icon ? (
      <>
        <Icon icon={meta.icon}></Icon>
        <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
          {t(title)}
        </span>
      </>
    ) : (
      <span class="v-menu__title overflow-hidden overflow-ellipsis whitespace-nowrap">
        {t(title)}
      </span>
    )
  }
  return {
    renderMenuTitle
  }
}
//# sourceMappingURL=useRenderMenuTitle.jsx.map
