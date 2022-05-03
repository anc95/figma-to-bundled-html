import { Collapse } from 'antd'
import { LangManagement } from './langManagement'
import { ResourceManagement } from './resourceManagement'
import { useRecoilState, useRecoilValue } from 'recoil'
import { langsAtom, resourceAtom, resourceKeysAtom } from '@/ui/state/langs';
import { useCallback } from 'react';
import { PluginData } from '@/types/config';
import { EventType, sendMessageToCode } from '@/utils/event';

const { Panel } = Collapse;

export const I18n = () => {
  const [langs, updateLangs] = useRecoilState(langsAtom)
  const [resource, updateResource] = useRecoilState(resourceAtom)
  const textKeys = useRecoilValue(resourceKeysAtom)

  const handleLangsChange = useCallback((langs: string[]) => {
    updateLangs(langs)

    sendMessageToCode(EventType.SetPluginData, {
      key: 'langs',
      value: langs
    })
  }, [updateLangs])

  const handleResourceChange = useCallback((resource: PluginData['i18nResource']) => {
    updateResource(resource)

    sendMessageToCode(EventType.SetPluginData, {
      key: 'i18nResource',
      value: resource
    })
  }, [])

  return <Collapse>
    <Panel header="Lang Management" key="lang-management">
      <LangManagement langs={langs} onChange={handleLangsChange} />
    </Panel>
    <Panel header="Resource Management" key="resource-management">
      <ResourceManagement onChange={handleResourceChange} langs={langs} resource={resource} textKeys={textKeys}  />
    </Panel>
  </Collapse>
}