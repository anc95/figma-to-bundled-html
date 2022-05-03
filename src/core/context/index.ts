import { createClassStyleStore } from './classStyleStore'

interface Context {
  classStyleStore: ReturnType<typeof createClassStyleStore>,
  rootNode: SceneNode,
  textKeys: Set<string>
}

export const createContext = ({
  rootNode
}: Omit<Context, 'classStyleStore' | 'textKeys'>) => {
  const classStyleStore = createClassStyleStore()
  const textKeys = new Set<string>()

  return {
    rootNode,
    textKeys,
    classStyleStore
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