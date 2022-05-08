export const createCustomScriptStore = (rootNode: SceneNode) => {
  const resource = JSON.parse(rootNode.getPluginData('customScript') || '""')
  let customScript = resource

  return {
    get: () => customScript,
    set: (value: string) => customScript = value
  }
}