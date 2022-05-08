import { Editor, EditorProps } from "@/ui/component/editor"
import { langsAtom } from "@/ui/state/langs"
import { customScriptAtom, htmlAtom, jsonResultAtom } from "@/ui/state/result"
import { EventType, sendMessageToCode } from "@/utils/event"
import { useCallback } from "react"
import { useRecoilValue } from "recoil"

const Script = () => {
  const currentHtml = useRecoilValue(htmlAtom)
  const langs = useRecoilValue(langsAtom)
  const customScript = useRecoilValue(customScriptAtom)
  const jsonResult = useRecoilValue(jsonResultAtom)

  const files: EditorProps['files'] = [
    {
      name: 'Generated HTML',
      options: {
        value: currentHtml,
        mode: 'htmlmixed'
      }
    },
    {
      name: 'JSON Result',
      options: {
        readOnly: true,
        value: JSON.stringify(jsonResult, null, 2),
        mode: 'htmlmixed'
      }
    },
    {
      name: 'Custom Script',
      options: {
        readOnly: false,
        value: customScript,
        mode: 'htmlmixed'
      }
    }
  ]

  const handleSave = useCallback((name: string, code: string) => {
    if (name === 'Custom Script') {
      sendMessageToCode(EventType.SetPluginData, {
        key: 'customScript',
        value: code
      })
    }
  }, [])

  const handleSelectedFileChange = useCallback((name: string) => {
    if (name === 'JSON Result') {
      sendMessageToCode(EventType.JSONResult, langs)
    }
  }, [])

  console.log('jsonResult', jsonResult)

  return <Editor onSelectedFileChange={handleSelectedFileChange} onSave={handleSave} files={files} />
}

export { Script }