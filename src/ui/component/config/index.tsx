import { Form, FormInstance, InputNumber, Select } from 'antd'
import { useCallback, useImperativeHandle } from 'react'
import * as React from 'react'
import { useRecoilState } from 'recoil'
import { langsAtom } from '../../state/langs'

interface ConfigProps {
  value?: {
    width: number
    height: number
  },
  onChange?: (changedValue: Partial<ConfigProps['value']>, values: ConfigProps['value']) => void
}

export type ConfigHandle = {
  form: FormInstance<ConfigProps['value']>
}

export const Config = React.forwardRef<ConfigHandle, ConfigProps>((props, ref) => {
  const {
    value = {},
    onChange,
  } = props

  const [langs] = useRecoilState(langsAtom)
  
  useImperativeHandle(ref, () => {
    return {
      form
    }
  })

  const [form] = Form.useForm<ConfigProps['value']>()

  const handleOnChange = useCallback((
    changedValue: Partial<ConfigProps['value']>,
    values: ConfigProps['value']
  ) => {
    onChange?.(changedValue, values)
  }, [onChange])

  return <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onValuesChange={handleOnChange} initialValues={value}>
    <Form.Item
    label="width"
    name="width"
    >
      <InputNumber addonAfter='px' />
    </Form.Item>
    <Form.Item
    label="height"
    name="height"
    >
      <InputNumber addonAfter='px' />
    </Form.Item>
    <Form.Item
    label="lang"
    name="lang"
    >
      <Select>
        {
          langs.map(lang => <Select.Option key={lang} value={lang}>{lang}</Select.Option>)
        }
      </Select>
    </Form.Item>
  </Form>
})