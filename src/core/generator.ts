import { BaseSegment } from '@/types/segment'
import { createStyleStringFromJSON } from '@/utils/style'
import { context } from './context'
import { FrameProcessor, TextProcessor, ImageProcessor } from './processor'

const hasTextChildren = (node: SceneNode) => {
  if (node.type === 'TEXT') {
    return true;
  }

  return ((node as any).children || []).some(child => hasTextChildren(child))
}

const generateSegmentTree = async (selection: readonly SceneNode[]) => {
  const tree: BaseSegment = {
    tag: 'body',
    className: '',
    style: {},
    children: []
  }

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
          const frameProcessor = new FrameProcessor(figmaChild)
          child = await frameProcessor.run()

          break

        default:
          console.warn(`Unhandled node type: ${figmaChild.type}`, figmaChild)
      }

      if (child) {
        containers.push(child)
        await traverse(child.children, (figmaChild as any).children || [])
      }
    }
  }

  await traverse(tree.children, selection as any)

  console.log(tree)

  return tree
}

export const generateHTML = async () => {
  const segmentTree = await generateSegmentTree(figma.currentPage.selection)

  const traverse = <T extends BaseSegment>(node: T) => {
    if (node.tag === 'br') {
      return '</br>'
    }

    if ((node as any).content) {
      return (node as any).content
    }

    const str = `<${node.tag} ${node.className ? `class=\"${node.className}\"` : ''} style="${createStyleStringFromJSON(node.style)}">
      ${node.children ? node.children.map(child => traverse(child)).join('') : ''}
      ${(node as any).text ? (node as any).text : ''}
    </${node.tag}>
    `.trim()

    return str;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  ${context.classStyleStore.generateStyle()}
</head>
${traverse(segmentTree)}
</html>
`
}