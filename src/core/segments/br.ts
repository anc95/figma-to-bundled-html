import { BaseSegment } from "./base"

export class BrSegment extends BaseSegment {
  className: string
  tag: string
  style: Record<string, string>
  children: BaseSegment[]

  constructor() {
    super()
    this.tag = 'br'
  }
  attributes?: Record<string, string>
  public renderattributes: () => string
}