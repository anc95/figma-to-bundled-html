interface PreviewProps {
  html: string
  width?: number
  height?: number
}

const Preview = (props: PreviewProps) => {
  const {
    html,
    width,
    height
  } = props

  return <iframe className="rounded-sm shadow-md" width={`${width || 360}px`} height={`${height || 700}px`} srcDoc={html}/>
}

export { Preview }