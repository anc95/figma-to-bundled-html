import { createClassStyleStore } from './classStyleStore'

export const createContext = () => {
  const classStyleStore = createClassStyleStore()

  return {
    classStyleStore
  }
}

export type ContextType = ReturnType<typeof createContext>

export const context = createContext()