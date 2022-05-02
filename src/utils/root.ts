const findLatestCommonParent = (node1: SceneNode, node2: SceneNode) => {
  const searchList = [node1]
  let node = node1;

  while (node.parent) {
    node = node.parent as any
    searchList.push(node)
  }

  node = node2;
  
  while (!searchList.includes(node)) {
    node = node.parent as any;
  }

  return node
}

export const findRootNode = () => {
  const selection = figma.currentPage.selection

  if (selection.length === 1) {
    return selection[0]
  }

  let baseCommon = findLatestCommonParent(...(selection.slice(0, 2) as [SceneNode, SceneNode]));

  for (let i = 2; i < selection.length; i++) {
    baseCommon = findLatestCommonParent(baseCommon, selection[i])
  }

  return baseCommon
}