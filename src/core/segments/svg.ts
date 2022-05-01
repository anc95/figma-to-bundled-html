import { BaseSegment } from "./base";

export class SVGSegment extends BaseSegment {
  className?: string;
  tag: string;
  style?: Record<string, string>;
  children?: BaseSegment[];
  content: string

  constructor() {
    super()

    this.tag = ''
    this.content = ''
  }
}