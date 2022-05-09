export const findRootNode = () => {
  let node: any = figma.currentPage.selection[0]

  while (node?.parent?.type !== 'PAGE') {
    node = node.parent
  }

  return node
}