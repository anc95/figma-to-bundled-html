import { useCallback, useEffect, useRef, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { Tabs } from 'antd'
import { Preview, Config, ConfigHandle, I18n, Script } from './component'
import 'antd/dist/antd.css';
import './main.css'
import { EventType, sendMessageToCode } from '@/utils/event';
import { PluginData, PreviewConfig } from '@/types/config';
import { RecoilRoot, useSetRecoilState } from 'recoil'
import { langsAtom, resourceAtom, resourceKeysAtom } from './state/langs';
import { CodeOutlined, GlobalOutlined, SettingOutlined } from '@ant-design/icons';
import { customScriptAtom, htmlAtom, jsonResultAtom } from './state/result';

const { TabPane } = Tabs;

const App = () => {
  const [html, setHtml] = useState('')

  const [config, setConfig] = useState<PreviewConfig>({
    width: 400,
    height: 600
  })

  const updateLangs = useSetRecoilState(langsAtom)
  const updateTextKeys = useSetRecoilState(resourceKeysAtom)
  const updateResource = useSetRecoilState(resourceAtom)
  const updateHtml = useSetRecoilState(htmlAtom)
  const updateJSONResult = useSetRecoilState(jsonResultAtom)
  const updateCustomScript = useSetRecoilState(customScriptAtom)

  const configRef = useRef<ConfigHandle>();

  useEffect(() => {
    sendMessageToCode(EventType.UILoaded)

    window.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data.pluginMessage

      switch(type) {
        case EventType.HtmlReady: {
          setHtml(data)
          updateHtml(data)
          break
        }
        case EventType.InitialData: {
          const pluginData = data as PluginData

          if (pluginData.previewConfig) {
            setConfig(pluginData.previewConfig)
            configRef.current.form.setFieldsValue(pluginData.previewConfig)
            updateLangs(pluginData.langs)
            updateResource(pluginData.i18nResource)
            updateCustomScript(pluginData.customScript || '')
          }
          break
        }
        case EventType.TextKeys: {
          updateTextKeys(data)
          break
        }
        case EventType.JSONResultReady: {
          updateJSONResult(data)
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

    if (_changedValue?.lang) {
      sendMessageToCode(EventType.ChangeLang, _changedValue.lang)
    }
  }, [])

  return <div className="flex m-5">
    <div className="basis-1/3">
      <Preview html={html} width={config.width} height={config.height} />
    </div>  
    <div className='basis-2/3 ml-10'>
      <Tabs defaultActiveKey="1" onChange={(a) => console.log(a)}>
        <TabPane
          tab={<SettingOutlined title='Preview Settings' />}
          key="preview-config"
        >
          <Config ref={configRef} value={config} onChange={handleConfigChange} />
        </TabPane>
        <TabPane tab={<GlobalOutlined />} key='i18n'>
          <I18n />
        </TabPane>
        <TabPane tab={<CodeOutlined />} key='code'>
          <Script />
        </TabPane>
      </Tabs>
    </div>
  </div>
}

ReactDOM.render(<RecoilRoot><App /></RecoilRoot>, document.getElementById('react-page'))