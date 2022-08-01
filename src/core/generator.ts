import { createStyleStringFromJSON } from '@/utils/style'
import { useContext } from './context'
import { FrameProcessor, TextProcessor, ImageProcessor } from './processor'
import { BaseSegment } from './segments'

const hasTextChildren = (node: SceneNode) => {
  if (node.type === 'TEXT') {
    return true;
  }

  return ((node as any).children || []).some(child => hasTextChildren(child))
}

const sort = (children: SceneNode[]) => {
  const result = []
  
  for (const node of children) {
    if (!result.length) {
      result.push(node)
    }

    for (let i = 0; i <= result.length; i++) {
      if (i === result.length) {
        result.push(node)
        break;
      }

      if (node.y < result[i].y) {
        result.splice(i, 0, node)
        break
      }
    }
  }
console.log(result,'result')
  return result
}

const generateSegmentTree = async (selection: readonly SceneNode[]) => {
  const tree = new BaseSegment()
  tree.tag = 'body'

  const traverse = async (containers: any[], figmaChildren: SceneNode[]) => {
    for (const figmaChild of figmaChildren) {
      let child: BaseSegment = null

      if (!hasTextChildren(figmaChild)) {
        const rectangleProcessor = new ImageProcessor(figmaChild)
        child = await rectangleProcessor.run()
        containers.push(child)
        continue
      }

      switch (figmaChild.type) {
        case 'TEXT':
          const textProcessor = new TextProcessor(figmaChild)
          child = await textProcessor.run()
          
          break
        case 'FRAME':
        case 'GROUP':
          const frameProcessor = new FrameProcessor(figmaChild as any)
          child = await frameProcessor.run()

          break

        default:
          console.warn(`Unhandled node type: ${figmaChild.type}`, figmaChild)
      }

      if (child) {
        containers.push(child)
        await traverse(child.children, sort((figmaChild as any).children || []))
      }
    }
  }

  await traverse(tree.children, selection as any)

  return tree
}

export const generateHTML = async () => {
  const segmentTree = await generateSegmentTree(figma.currentPage.selection)
  const context = useContext()

  const getText = (text: string | undefined) => {
    if (!text) {
      return ''
    }

    return context.i18n.t(text)
  }

  const traverse = <T extends BaseSegment>(node: T) => {
    if (node.tag === 'br') {
      return '</br>'
    }

    if ((node as any).content) {
      return (node as any).content
    }

    const str = `<${node.tag} ${node?.renderattributes?.() || ''} ${node.className ? `class=\"${node.className}\"` : ''} style="${createStyleStringFromJSON(node.style)}">
      ${node.children ? node.children.map(child => traverse(child)).join('') : ''}
      ${getText((node as any).text)}
    </${node.tag}>
    `.trim()

    return str;
  }

  return () =>
`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${context.i18n.t('document.title')}</title>
    ${context.classStyleStore.generateStyle()}
    ${context.customScript.get()}
  </head>
  ${traverse(segmentTree)}
</html>
`
}