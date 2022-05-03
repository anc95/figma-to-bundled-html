import { Button, Input, Tag } from 'antd'
import { useCallback, useState } from 'react';
import { I18nProps } from "./type";

interface LangManagementProps {
  langs?: I18nProps['langs'],
  onChange?: (langs: I18nProps['langs']) => void
}

export const LangManagement = (props: LangManagementProps) => {
  const {
    langs,
    onChange
  } = props

  const [inputValue, setInputValue] = useState('')

  const handleLangsChange = useCallback((langs: string[]) => {
    onChange?.(langs)
  }, [onChange])

  const handleDeleteLang = useCallback((lang: string) => {
    const newLangs = langs.filter(l => l !== lang)
    handleLangsChange(newLangs)
  }, [langs, handleLangsChange])

  const handleAddNewLang = useCallback(() => {
    if (!inputValue) {
      return
    }

    const newLangs = Array.from(new Set(langs).add(inputValue))

    if (newLangs.length !== langs.length) {
      handleLangsChange(newLangs)
      setInputValue('')
    }
  }, [langs, inputValue, handleLangsChange])

  return <div>
    <div className='mb-4'>
      {langs.map(lang => <Tag closable onClick={() => handleDeleteLang(lang)}>{lang}</Tag>)}
    </div>
    <Input value={inputValue} placeholder='new lang' onChange={e => setInputValue(e.target.value)} suffix={<Button onClick={handleAddNewLang}>Add</Button>}/>
  </div>
}