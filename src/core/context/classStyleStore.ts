import { calcCssStyleFromStyleId, createStyleStringFromJSON } from '@/utils/style'

export const createClassStyleStore = () => {
  const store = new Map<string, Record<string, string>>()
  const idNameMap = new Map<string, string>()

  const record = id => {
    let { name } = figma.getStyleById(id)

    if (!name) {
      name = id;
    } else {
      name = name.replace(/\s/g, '');
    }

    if (!store.get(id)) {
      store.set(id, calcCssStyleFromStyleId(id))
      idNameMap.set(id, name)
    }

    return store.get(id)
  }

  const getStyle = (id: string) => {
    return store.get(id)
  }

  const getClassName = (id: string) => {
    return idNameMap.get(id) || ''
  }

  const generateStyle = () => {
    let styleString = ''

    for (const [key] of store) {
      const className = getClassName(key);
      const style = getStyle(key)

      styleString += `\n.${className}{\n${createStyleStringFromJSON(style)}\n}`
    }

    return `<style>\n${styleString}\n</style>`
  }

  return {
    record,
    getStyle,
    getClassName,
    generateStyle
  }
}