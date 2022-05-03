import { PluginData } from '@/types/config'
import { atom } from 'recoil'

export const langsAtom = atom<PluginData['langs']>({
  key: 'langs',
  default: []
})

export const resourceAtom = atom<PluginData['i18nResource']>({
  key: 'resource',
  default: {}
})

export const resourceKeysAtom = atom<string[]>({
  key: 'rawTexts',
  default: []
})