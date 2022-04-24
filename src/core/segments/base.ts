import { BaseSegment as IBaseSegment } from '@/types/segment'

export class BaseSegment implements IBaseSegment {
  className?: string;
  tag: string;
  style?: Record<string, string>;
  children?: BaseSegment[];

  constructor() {
    this.className = ''
    this.tag = 'div'
    this.style = {}
    this.children = []
  }
}