import { calcFrameCssStyle } from "@/utils/style"
import { BaseSegment } from "../segments"

export class FrameProcessor {
  frameNode: FrameNode

  constructor(node: FrameNode) {
    this.frameNode = node
  }

  async run() {
    const container = new BaseSegment()
    container.style = await calcFrameCssStyle(this.frameNode)
    
    return container
  }
}