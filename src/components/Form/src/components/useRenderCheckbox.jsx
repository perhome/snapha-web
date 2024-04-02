import { ComponentNameEnum } from '../types'
import { ElCheckbox, ElCheckboxButton } from 'element-plus'
export const useRenderCheckbox = () => {
  const renderCheckboxOptions = (item) => {
    // 如果有别名，就取别名
    const componentProps = item?.componentProps
    const valueAlias = componentProps?.props?.value || 'value'
    const labelAlias = componentProps?.props?.label || 'label'
    const disabledAlias = componentProps?.props?.disabled || 'disabled'
    const Com = item.component === ComponentNameEnum.CHECKBOX_GROUP ? ElCheckbox : ElCheckboxButton
    return componentProps?.options?.map((option) => {
      const { value, ...other } = option
      return (
        <Com
          {...other}
          disabled={option[disabledAlias || 'disabled']}
          label={option[valueAlias || 'value']}
        >
          {option[labelAlias || 'label']}
        </Com>
      )
    })
  }
  return {
    renderCheckboxOptions
  }
}
//# sourceMappingURL=useRenderCheckbox.jsx.map
