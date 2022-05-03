import { useCallback, useEffect, useRef, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { Tabs } from 'antd'
import { Preview, Config, ConfigHandle, I18n } from './component'
import 'antd/dist/antd.css';
import './main.css'
import { EventType, sendMessageToCode } from '@/utils/event';
import { PluginData, PreviewConfig } from '@/types/config';
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import { langsAtom } from './state/langs';

const { TabPane } = Tabs;

const App = () => {
  const [html, setHtml] = useState('')

  const [config, setConfig] = useState<PreviewConfig>({
    width: 400,
    height: 600
  })

  const updateLangs = useSetRecoilState(langsAtom)

  const configRef = useRef<ConfigHandle>();

  useEffect(() => {
    sendMessageToCode(EventType.UILoaded)

    window.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data.pluginMessage

      switch(type) {
        case EventType.HtmlReady: {
          setHtml(data)
          break
        }
        case EventType.InitialData: {
          const pluginData = data as PluginData

          if (pluginData.previewConfig) {
            setConfig(pluginData.previewConfig)
            configRef.current.form.setFieldsValue(pluginData.previewConfig)
          }
          break
        }
        default:
          console.warn(`Unknown event: ${type}`, event)
      }
    }

    return () => window.onmessage = null
  }, [setConfig])

  const handleConfigChange = useCallback((_changedValue, values: PreviewConfig) => {
    setConfig(values)
    sendMessageToCode(EventType.SetPluginData, { key: 'previewConfig', value: values })
  }, [])

  return <div className="flex m-5">
    <div className="basis-1/3">
      <Preview html={html} width={config.width} height={config.height} />
    </div>  
    <div className='basis-2/3 ml-10'>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab='Config'
          key="1"
        >
          <Config ref={configRef} value={config} onChange={handleConfigChange} />
        </TabPane>
        <TabPane tab='I18n' key='i18n'>
          <I18n />
        </TabPane>
      </Tabs>
    </div>
  </div>
}

ReactDOM.render(<RecoilRoot><App /></RecoilRoot>, document.getElementById('react-page'))