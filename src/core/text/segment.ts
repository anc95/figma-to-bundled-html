import { BaseSegment } from '@/types/segment'
import { solidPaintToCssColor, calcCssStyleFromStyleId, calcTextCssStyle } from '@/utils/style'
import { context } from '@/core/context'

export class TextSegment implements BaseSegment {
  public children;
  public className: string;
  public tag: string;
  public style: Record<string, string>;
  public text: string

  constructor() {
    this.tag = 'p',
    this.style = {
      'display': 'inline-block'
    },
    this.className = ''
    this.text = ''
    this.children = []
  }

  fillFigma(figmaSegment: Partial<StyledTextSegment>) {
    const {
      characters,
			fills,
      textStyleId
    } = figmaSegment

    this.text = characters

    // TODO: condiser there fills are more than one
    if (fills.length) {
      const solidPaint = fills.find(fill => fill.type === 'SOLID') as SolidPaint
      this.style.color = solidPaintToCssColor(solidPaint)
    }

    if (textStyleId) {
      context.classStyleStore.record(textStyleId)
      this.className = context.classStyleStore.getClassName(textStyleId)
    } else {
      Object.assign(this.style, calcTextCssStyle(figmaSegment as any))
    }
  }
}