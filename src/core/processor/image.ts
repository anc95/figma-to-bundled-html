import { SVGSegment } from "../segments"

export class ImageProcessor {
  ImageNode: SceneNode

  constructor(node: SceneNode) {
    this.ImageNode = node
  }

  async run() {
    const container = new SVGSegment()
    const svg = await this.ImageNode.exportAsync({format: 'SVG'})

    container.content = String.fromCharCode(...svg)

    return container
  }
}