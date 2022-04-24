import { base64Image } from "./base64"

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

export const processGeometryProperties = async (originNode: SceneNode) => {
  const {
    fills
  } = originNode as GeometryMixin

  const style = {}

  if (Array.isArray(fills)) {
    const imgFill = (fills as Paint[]).find(fill => fill.type === 'IMAGE');

    if (imgFill) {
      const imageHash = await originNode.exportAsync()
      const {
        width, height
      } = originNode

      Object.assign(style, {
        width: `${width}px`,
        height: `${height}px`,
        background: `url('${base64Image(imageHash)}')`
      })

      return style
    }
  }

  return style
}

export const calcTextCssStyle = async (style: TextStyle) => {
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

  if (fontName.style) {
    switch (fontName.style) {
      case 'SemiBold':
      case 'Bold':
        cssStyle['font-weight'] = 600
      default:
        console.warn(`Unknown fontName.style ${fontName.style}`)
    }
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

export const calcCssStyleFromStyleId = async (styleId: string) => {
  const style = figma.getStyleById(styleId)

  if (style.type === 'TEXT') {
    return calcTextCssStyle(style as TextStyle)
  }

  return {}
}

export const calcTextNodeCssStyle = async (textNode: TextNode) => {
  const style: Record<string, string> = {}

  const {
    fills,
    height,
    textAlignHorizontal,
    textAlignVertical,
    fontName
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
console.log(fontName)
  Object.assign(style, await calcTextCssStyle({fontName} as any))

  console.log(style)

  return style
}

export const calcFrameCssStyle = async (textNode: FrameNode) => {
  const {
    layoutMode,
    width,
    height,
    primaryAxisSizingMode,
    counterAxisSizingMode,
    primaryAxisAlignItems,
    counterAxisAlignItems,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    itemSpacing,
    clipsContent,
    cornerRadius,
    layoutAlign,
    layoutGrow
  } = textNode

  const style = {}

  if (layoutMode && layoutMode != 'NONE') {
    style['display'] = 'flex'
    style['flex-direction'] = layoutMode === 'HORIZONTAL' ? 'row' : 'column'
    style['flex-wrap'] = 'wrap'
  }

  if (primaryAxisSizingMode === 'FIXED') {
    if (layoutMode === 'HORIZONTAL') {
      style['width'] = `${width}px`
    } else {
      style['height'] = `${height}px`
    }
  }

  if (counterAxisSizingMode === 'FIXED') {
    if (layoutMode === 'HORIZONTAL') {
      style['height'] = `${height}px`
    } else {
      style['width'] = `${width}px`    }
  }

  if (primaryAxisAlignItems) {
    switch (primaryAxisAlignItems) {
      case 'MIN':
        style['justify-content'] = 'flex-start'
        break
      case 'MAX':
        style['justify-content'] = 'flex-end'
        break
      case 'CENTER':
        style['justify-content'] = 'center'
        break
      case 'SPACE_BETWEEN':
        style['justify-content'] = 'space-between'
        break
      default:
        console.warn(`no matched primaryAxisAlignItems: ${primaryAxisAlignItems}`)
    }
  }

  if (counterAxisAlignItems) {
    switch (counterAxisAlignItems) {
      case 'MIN':
        style['align-items'] = 'flex-start'
        break
      case 'MAX':
        style['align-items'] = 'flex-end'
        break
      case 'CENTER':
        style['align-items'] = 'center'
        break
      default:
        console.warn(`no matched counterAxisAlignItems: ${counterAxisAlignItems}`)
    }
  }

  if (typeof paddingLeft === 'number') {
    style['box-sizing'] = 'border-box'
    style['padding'] = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`
  }

  if (itemSpacing) {
    // TODO: need to set style for the children
  }

  if (typeof cornerRadius === 'number') {
    style['box-radios'] = `${cornerRadius}px`
  }

  if (clipsContent) {
    style['overflow'] = 'hidden'
  }

  if (layoutAlign === 'STRETCH') {
    style['align-self'] = 'stretch'
  }

  if (layoutGrow) {
    style['flex-grow'] = layoutGrow
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