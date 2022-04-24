import { BaseSegment } from '@/types/segment'

export class BrSegment implements BaseSegment {
  className: string
  tag: string
  style: Record<string, string>
  children: BaseSegment[]

  constructor() {
    this.tag = 'br'
  }
}