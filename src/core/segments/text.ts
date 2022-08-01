import { solidPaintToCssColor, calcTextCssStyle } from '@/utils/style'
import { useContext } from '@/core/context'
import { BaseSegment } from './base';

export class TextSegment extends BaseSegment {
  public children;
  public className: string;
  public tag: string;
  public style: Record<string, string>;
  public text: string

  constructor() {
    super()

    this.tag = 'div',
    this.style = {
      'display': 'inline-block'
    },
    this.className = ''
    this.text = ''
    this.children = []
  }
  attributes?: Record<string, string>;
  renderattributes: () => string;

  async fillFigma(figmaSegment: Partial<StyledTextSegment>) {
    const {
      characters,
			fills,
      textStyleId
    } = figmaSegment

    this.text = characters.replace(/[\x20]+$/g, '&nbsp;').replace("\n", '<br/>')

    // TODO: condiser there fills are more than one
    if (fills.length) {
      const solidPaint = fills.find(fill => fill.type === 'SOLID') as SolidPaint
      this.style.color = solidPaintToCssColor(solidPaint)
    }

    if (textStyleId) {
      await useContext().classStyleStore.record(textStyleId)
      this.className = useContext().classStyleStore.getClassName(textStyleId)
    }

    Object.assign(this.style, await calcTextCssStyle(figmaSegment as any))
  }
}