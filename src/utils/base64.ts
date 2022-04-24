export const base64Image = (typedA: Uint8Array) => {
  return `data:image/png;base64,${figma.base64Encode(typedA)}`
}