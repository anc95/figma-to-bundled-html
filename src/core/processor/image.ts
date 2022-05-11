import { SVGSegment } from "../segments"
import { ImageSegment } from "../segments/Image"

export class ImageProcessor {
  ImageNode: SceneNode

  constructor(node: SceneNode) {
    this.ImageNode = node
  }

  async run() {
    const width = this.ImageNode.width
    const useSVG = width < 50

    const container = useSVG ? new SVGSegment() : new ImageSegment()

    if (container.tag === 'img') {
      const image = await this.ImageNode.exportAsync({format: 'PNG'})
      container.attributes['src'] = `data:image/png;base64,${figma.base64Encode(image)}`
    }
    else {
      const svg = await this.ImageNode.exportAsync({format: 'SVG'})
      container.content = String.fromCharCode(...svg)
    }

    return container
  }
}