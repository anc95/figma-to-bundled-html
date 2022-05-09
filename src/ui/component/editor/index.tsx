import CodeMirror from 'react-codemirror'
import { Button, Tabs } from 'antd'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import { useCallback, useRef, useState } from 'react'

const { TabPane } = Tabs

export interface EditorProps {
  files: {
    name: string
    options: CodeMirror['props']['options']
  }[],
  onSave?: (name: string, code: string) => void,
  onSelectedFileChange?: (name: string) => void
}

export const Editor = (props: EditorProps) => {
  const [changedFiles, setChangedFiles] = useState([])
  const filesCodeRef = useRef<Map<string, string>>(new Map<string, string>())

  const handleCodeChange = useCallback((name: string, code: string) => {
    if (!changedFiles.includes(name)) {
      setChangedFiles([...changedFiles, name])
    }
    filesCodeRef.current.set(name, code)
  }, [changedFiles])

  const handleSave = useCallback((name: string) => {
    const code = filesCodeRef.current.get(name)
    props.onSave?.(name, code)

    setChangedFiles(changedFiles.filter(file => file !== name))
  }, [changedFiles])

  const handleTabChange = useCallback((name: string) => {
    props.onSelectedFileChange?.(name)
  }, [props.onSelectedFileChange])

  return <div>
    <Tabs type='card' className="relative" onChange={handleTabChange}>
      {
        props.files.map(
          file => <TabPane 
            key={file.name} 
            tab={
              <div>
                <span>{file.name}</span>
                {
                  changedFiles.includes(file.name) ?
                    <span className="w-2 h-2 rounded ml-2 inline-block bg-gray-700"></span>
                    : null
                }
              </div>}
          >
            <CodeMirror onChange={(code) => handleCodeChange(file.name, code)} value={file.options.value as string} options={file.options} />
            {
              changedFiles.includes(file.name) ?
              <Button onClick={() => handleSave(file.name)} type='text' style={{left: '420px'}} className="absolute top-0">Save</Button>
              : null
            }
          </TabPane>
        )
      }
    </Tabs>
  </div>
}