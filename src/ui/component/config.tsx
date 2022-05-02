import { Form, InputNumber } from 'antd'
import { useCallback } from 'react'

interface ConfigProps {
  value?: {
    width: number
    height: number
  },
  onChange?: (changedValue: Partial<ConfigProps['value']>, values: ConfigProps['value']) => void
}

export const Config = (props: ConfigProps) => {
  const {
    value = {},
    onChange,
  } = props

  const handleOnChange = useCallback((
    changedValue: Partial<ConfigProps['value']>,
    values: ConfigProps['value']
  ) => {
    onChange?.(changedValue, values)
  }, [onChange])

  return <Form onValuesChange={handleOnChange} initialValues={value}>
    <Form.Item
    label="width"
    name="width"
    >
      <InputNumber />
    </Form.Item>
    <Form.Item
    label="height"
    name="height"
    >
      <InputNumber />
    </Form.Item>
  </Form>
}