export interface PreviewConfig {
  width: number
  height: number
  lang?: string
}

export interface PluginData {
  previewConfig: PreviewConfig
  i18nResource: Record<string, Record<string, string>>
  langs: string[]
  customScript: string
}

export type PluginDataKey = keyof PluginData