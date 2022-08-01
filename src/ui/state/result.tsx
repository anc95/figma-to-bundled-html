import { atom } from 'recoil'

export const htmlAtom = atom<string>({
  key: 'html',
  default: ''
})

export const jsonResultAtom = atom<string>({
  key: 'json-result',
  default: ''
})

export const customScriptAtom = atom<string>({
  key: 'custom-script',
  default: '',
})