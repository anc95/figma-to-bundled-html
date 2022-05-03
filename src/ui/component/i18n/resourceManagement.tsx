import { PluginData } from '@/types/config'
import { Collapse, Form, Input } from 'antd'
import { useMemo, useState } from 'react'

const { Panel } = Collapse
const { TextArea } = Input

interface ResourceManagementProps {
  textKeys: string[],
  langs: string[],
  resource: PluginData['i18nResource']
}

export const ResourceManagement = (props: ResourceManagementProps) => {
  const {
    textKeys,
    resource,
    langs
  } = props

  const [filter, setFilter] = useState('');
  const filteredKeys = useMemo(() => {
    return textKeys.filter(key => key.includes(filter))
  }, [filter, textKeys])

  return <div>
    <Input className='mb-3' placeholder='text filter' allowClear onChange={e => setFilter(e.target.value)} />
    <Collapse>
    {
      filteredKeys.map(key => {
        return <Panel header={key} key={key}>
          { 
            <Form layout='horizontal'>
              {
                langs.map(lang => {
                  return <Form.Item label={lang}>
                    <TextArea defaultValue={resource?.[lang]?.[key] || ''} />
                  </Form.Item>
                })
              }
            </Form>
          }
        </Panel>
      })
    }
  </Collapse>
  </div>
}