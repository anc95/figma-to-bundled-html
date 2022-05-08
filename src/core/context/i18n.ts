import { PluginData } from "@/types/config"

const createI18n = (rootNode: SceneNode) => {
  let lang = ''
  let resource = JSON.parse(rootNode.getPluginData('i18nResource') || '{}')

  const updateLang = (_lang: string) => lang = _lang
  const updateResource = (_resource: PluginData['i18nResource']) => resource = _resource
  const t = (key: string) => {
    return resource?.[lang]?.[key] || key
  }

  return {
    updateLang,
    updateResource,
    t,
    getLang: () => lang
  }
}

export { createI18n }