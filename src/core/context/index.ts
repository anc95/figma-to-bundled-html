import { createClassStyleStore } from './classStyleStore'

interface Context {
  classStyleStore: ReturnType<typeof createClassStyleStore>,
  rootNode: SceneNode
}

export const createContext = ({
  rootNode
}: Omit<Context, 'classStyleStore'>) => {
  const classStyleStore = createClassStyleStore()

  return {
    rootNode,
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