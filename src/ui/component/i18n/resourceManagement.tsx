import { PluginData } from '@/types/config'
import { Collapse, Form, Input, Progress } from 'antd'
import { ChangeEvent, ChangeEventHandler, useCallback, useMemo, useState } from 'react'

const { Panel } = Collapse
const { TextArea } = Input

interface ResourceManagementProps {
  textKeys: string[],
  langs: string[],
  resource: PluginData['i18nResource'],
  onChange: (resource: PluginData['i18nResource']) => void
}

export const ResourceManagement = (props: ResourceManagementProps) => {
  const {
    textKeys,
    resource,
    langs,
    onChange
  } = props

  const [filter, setFilter] = useState('');
  const filteredKeys = useMemo(() => {
    return textKeys.filter(key => key.includes(filter))
  }, [filter, textKeys])

  const handleTextChange = useCallback((lang: string, key: string, value: string) => {
    const resourceCopy = JSON.parse(JSON.stringify(resource))
    
    resourceCopy[lang] = resourceCopy[lang] || {}
    resourceCopy[lang][key] = value

    onChange?.(resourceCopy)
  }, [resource])

  return <div>
    <Input className='mb-3' placeholder='text filter' allowClear onChange={e => setFilter(e.target.value)} />
    <Collapse>
    {
      filteredKeys.map(key => {
        const translatedCount = (langs || []).reduce((res, lang) => {
          return res + ((resource?.[lang]?.[key] || '').trim() ? 1 : 0)
        }, 0)

        const translatedPercent = Math.floor((translatedCount / langs.length) * 100)

        return <Panel 
          header={<div style={{width: '100%'}} className='flex'>
            <div className='flex-1'>{key}</div>
            <div className='w-1/3'><Progress width={100} percent={translatedPercent} /></div>
          </div>} 
          key={key}
        >
          { 
            <Form layout='horizontal'>
              {
                langs.map(lang => {
                  return <Form.Item label={lang}>
                    <TextArea onChange={e => handleTextChange(lang, key, e.target.value)} defaultValue={resource?.[lang]?.[key] || ''} />
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