import { createClassStyleStore } from './classStyleStore'
import { createI18n } from './i18n'

interface Context {
  classStyleStore: ReturnType<typeof createClassStyleStore>,
  rootNode: SceneNode,
  textKeys: Set<string>,
  i18n: ReturnType<typeof createI18n>
}

export const createContext = ({
  rootNode
}: Pick<Context, 'rootNode'>) => {
  const classStyleStore = createClassStyleStore()
  const textKeys = new Set<string>()
  const i18n = createI18n(rootNode)

  return {
    rootNode,
    textKeys,
    classStyleStore,
    i18n
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