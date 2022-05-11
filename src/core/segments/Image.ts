import { BaseSegment } from "./base";

export class ImageSegment extends BaseSegment {
  className?: string;
  tag: 'img';
  style?: Record<string, string>;
  children?: BaseSegment[];
  content: string
  attributes?: Record<string, string>

  constructor() {
    super()

    this.tag = 'img'
    this.content = ''
    this.attributes = {}
  }
}