import { processGeometryProperties } from "@/utils/style"
import { BaseSegment } from "../segments"

export class RectangleProcessor {
  rectangleNode: RectangleNode

  constructor(node: RectangleNode) {
    this.rectangleNode = node
  }

  private calcRectangleCssStyle = async () => {
    return processGeometryProperties(this.rectangleNode)
  }

  async run() {
    const container = new BaseSegment()
    container.style = await this.calcRectangleCssStyle()
    return container
  }
}