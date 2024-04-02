import { ElOption, ElOptionGroup } from 'element-plus'
export const useRenderSelect = () => {
  // 渲染 select options
  const renderSelectOptions = (item) => {
    const componentsProps = item?.componentProps
    const optionGroupDefaultSlot = componentsProps?.slots?.optionGroupDefault
    // 如果有别名，就取别名
    const labelAlias = componentsProps?.props?.label
    const keyAlias = componentsProps?.props?.key
    return componentsProps?.options?.map((option) => {
      if (option?.options?.length) {
        return optionGroupDefaultSlot ? (
          optionGroupDefaultSlot(option)
        ) : (
          <ElOptionGroup label={option[labelAlias || 'label']} key={option[keyAlias || 'key']}>
            {{
              default: () =>
                option?.options?.map((v) => {
                  return renderSelectOptionItem(item, v)
                })
            }}
          </ElOptionGroup>
        )
      } else {
        return renderSelectOptionItem(item, option)
      }
    })
  }
  // 渲染 select option item
  const renderSelectOptionItem = (item, option) => {
    // 如果有别名，就取别名
    const componentsProps = item.componentProps
    const labelAlias = componentsProps?.props?.label
    const valueAlias = componentsProps?.props?.value
    const keyAlias = componentsProps?.props?.key
    const optionDefaultSlot = componentsProps.slots?.optionDefault
    return (
      <ElOption
        {...option}
        key={option[keyAlias || 'key']}
        label={option[labelAlias || 'label']}
        value={option[valueAlias || 'value']}
      >
        {{
          default: () => (optionDefaultSlot ? optionDefaultSlot(option) : undefined)
        }}
      </ElOption>
    )
  }
  return {
    renderSelectOptions
  }
}
//# sourceMappingURL=useRenderSelect.jsx.map
