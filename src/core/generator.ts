import { BaseSegment } from '@/types/segment'
import { createStyleStringFromJSON } from '@/utils/style'
import { context } from './context'
import { TextProcessor } from './text'

const generateSegmentTree = (selection: readonly SceneNode[]) => {
  const tree: BaseSegment = {
    tag: 'body',
    className: '',
    style: {},
    children: []
  }

  const traverse = () => {
    const containers = []

    selection.forEach(selection => {
      switch (selection.type) {
        case 'TEXT':
          const textProcessor = new TextProcessor(selection)
          containers.push(textProcessor.run())

          break;
      }
    })

    return containers
  }

  tree.children = traverse()

  return tree
}

export const generateHTML = () => {
  const segmentTree = generateSegmentTree(figma.currentPage.selection)

  const traverse = <T extends BaseSegment>(node: T) => {
    const str = `<${node.tag} className="${node.className || ""}" style="${createStyleStringFromJSON(node.style)}">
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