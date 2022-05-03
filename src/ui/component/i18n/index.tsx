import { Collapse } from 'antd'
import { LangManagement } from './langManagement'
import { ResourceManagement } from './resourceManagement'
import { useRecoilState } from 'recoil'
import { langsAtom, resourceAtom } from '@/ui/state/langs';
import { useCallback } from 'react';

const { Panel } = Collapse;

export const I18n = () => {
  const [langs, updateLangs] = useRecoilState(langsAtom)
  const [resource, updateResource] = useRecoilState(resourceAtom)

  const handleLangsChange = useCallback((langs: string[]) => {
    updateLangs(langs)
  }, [updateLangs])

  return <Collapse>
    <Panel header="Lang Management" key="lang-management">
      <LangManagement langs={langs} onChange={handleLangsChange} />
    </Panel>
    <Panel header="Resource Management" key="resource-management">
      <ResourceManagement langs={['en']} resource={resource} textKeys={['1', '2']}  />
    </Panel>
  </Collapse>
}