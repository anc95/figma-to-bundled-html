import { createClassStyleStore } from './classStyleStore'
import { createCustomScriptStore } from './customScript'
import { createI18n } from './i18n'

interface Context {
  classStyleStore: ReturnType<typeof createClassStyleStore>,
  rootNode: SceneNode,
  textKeys: Set<string>,
  i18n: ReturnType<typeof createI18n>,
  customScript: ReturnType<typeof createCustomScriptStore>
}

export const createContext = ({
  rootNode
}: Pick<Context, 'rootNode'>) => {
  const classStyleStore = createClassStyleStore()
  const textKeys = new Set<string>(['document.title'])
  const i18n = createI18n(rootNode)
  const customScript = createCustomScriptStore(rootNode)

  return {
    rootNode,
    textKeys,
    classStyleStore,
    i18n,
    customScript
  }
}

export type ContextType = ReturnType<typeof createContext>

let context: Context

export const setContext = (_context: Context) => {
  context = _context
}

export const useContext = () => {
  return context
}