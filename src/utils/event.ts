import { PluginData } from '@/types/config'

export enum EventType {
  HtmlReady,
  UILoaded,
  SetPluginData,
  InitialData
}

export const sendMessageToUI = <T>(type: EventType, data?: T) => {
  figma.ui.postMessage({
    type,
    data
  })
}

export const sendMessageToCode = <T>(type: EventType, data?: T) => {
  parent.postMessage({
    pluginMessage: {
      type,
      data
    } 
  }, '*')
}

export const getInitialData = (rootNode: SceneNode): PluginData => {
  const get = (key, defaultValue = null) => {
    return JSON.parse(rootNode.getPluginData(key) || JSON.stringify(defaultValue))
  }

  return {
    previewConfig: get('previewConfig'),
    i18nResource: get('i18nResource'),
    langs: get('langs')
  }
}