import { useCallback, useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { Tabs } from 'antd'
import { Preview, Config } from './component'
import 'antd/dist/antd.css';
import './main.css'
import { EventType, sendMessageToCode, DataKey } from '@/utils/event';
import { PreviewConfig } from '@/types/config';

const { TabPane } = Tabs;

const App = () => {
  const [html, setHtml] = useState('')

  const [config, setConfig] = useState<PreviewConfig>({
    width: 400,
    height: 600
  })

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
          console.log(data[DataKey.previewConfig])
          data[DataKey.previewConfig] && setConfig(data[DataKey.previewConfig])
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
    // sendMessageToCode(EventType.SetPluginData, { key: DataKey.previewConfig, value: values })
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
          <Config value={config} onChange={handleConfigChange} />
        </TabPane>
      </Tabs>
    </div>
  </div>
}

ReactDOM.render(<App />, document.getElementById('react-page'))