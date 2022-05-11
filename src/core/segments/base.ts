import { BaseSegment as IBaseSegment } from '@/types/segment'

export class BaseSegment implements IBaseSegment {
  className?: string;
  tag: string;
  style?: Record<string, string>;
  children?: BaseSegment[];
  attributes?: Record<string, string>;

  constructor() {
    this.className = ''
    this.tag = 'div'
    this.style = {}
    this.children = []
    this.attributes = {}
  }

  public renderattributes = () => {
    let result = ''

    if (!this.attributes) {
      return result
    }

    for (const key in this.attributes) {
      result += ` ${key}="${this.attributes[key]}"`
    }

    return result
  }
}