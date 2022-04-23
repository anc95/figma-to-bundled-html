export const solidPaintToCssColor = (paint: SolidPaint) => {
  const createColorValue = v => Math.floor(v * 255)

  return `rgba(${createColorValue(paint.color.r)},${createColorValue(paint.color.g)},${createColorValue(paint.color.b)},${paint.opacity ?? 0})`
}

const readPX = (v: number | { value?: number, unit: 'PIXELS' | 'PERCENT' | 'AUTO' }) => {
  if (typeof v === 'number') {
    if (v === 0) {
      return 'unset'
    }

    return `${v}px`
  }

  switch (v.unit) {
    case 'PERCENT':
      return `${v.value}%`
    case 'PIXELS':
      return `${v.value}px`
    case 'AUTO':
      return 'auto'
    default:
      console.warn(`Unknow px unit ${v.unit}`)
      return ''
  }
}

export const calcTextCssStyle = (style: TextStyle) => {
  const { 
    fontSize,
    textDecoration,
    fontName,
    letterSpacing,
    lineHeight,
    paragraphIndent
  } = style

  const cssStyle = {}

  if (fontSize) {
    cssStyle['font-size'] = fontSize
  }

  if (textDecoration === 'UNDERLINE') {
    cssStyle['text-declaration'] = 'underfine'
  }

  if (fontName.family) {
    cssStyle['font-family'] = fontName.family
  }

  if (letterSpacing) {
    cssStyle['letter-spacing'] = readPX(letterSpacing)
  }

  if (lineHeight) {
    cssStyle['line-height'] = readPX(lineHeight)
  }

  if (paragraphIndent) {
    cssStyle['text-indent'] = readPX(paragraphIndent)
  }

  return cssStyle
}

export const calcCssStyleFromStyleId = (styleId: string) => {
  const style = figma.getStyleById(styleId)

  if (style.type === 'TEXT') {
    return calcTextCssStyle(style as TextStyle)
  }

  return {}
}

export const calcTextContainerCssStyle = (textNode: TextNode) => {
  const style: Record<string, string> = {}

  const {
    fills,
    height,
    textAlignHorizontal,
    textAlignVertical
  } = textNode

  if (fills && Array.isArray(fills)) {
    const solidPaint = fills.find(fill => fill.type === 'SOLID')

    style.color = solidPaintToCssColor(solidPaint)
  }

  if (height) {
    style['min-height'] = `${height}px`
  }

  if (textAlignHorizontal) {
    switch (textAlignHorizontal) {
      case 'CENTER':
        style['text-align'] = 'center'
        break
      case 'LEFT':
      case 'JUSTIFIED':
        style['text-align'] = 'left'
        break
      case 'RIGHT':
        style['text-align'] = 'right'
        break;
      default:
        // do nothing, just leave unset
    }

    if (textAlignVertical) {
      let value = 'inherit'

      switch (textAlignVertical) {
        case 'BOTTOM':
          value = 'bottom'
          break
        case 'CENTER':
          value = 'center'
        case 'TOP':
          value = 'top'
        default:
          // do nothing, just leave inherit
      }

      style['vertical-align'] = value
    }
  }

  return style
}

export const createStyleStringFromJSON = (json: Record<string, string>) => {
  let str = ''

  if (!json) {
    return ''
  }

  for (const key in json) {
    str += `${key}:${json[key]};`
  }

  return str
}