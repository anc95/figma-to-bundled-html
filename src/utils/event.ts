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

export enum DataKey {
  previewConfig = 'preview-config'
}

export const getInitialData = (rootNode: SceneNode) => {
  const previewConfig = JSON.parse(rootNode.getPluginData(DataKey.previewConfig) || 'null')

  return {
    previewConfig
  }
}