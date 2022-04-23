import { BaseSegment } from '@/types/segment'
import { calcTextContainerCssStyle } from '@/utils/style'
import { TextSegment } from './segment'

export class TextProcessor {
	private textNode: TextNode

	constructor(textNode: TextNode) {
		this.textNode = textNode
	}

	private getSegments = () => {
		const originSegments = this.textNode.getStyledTextSegments(['fillStyleId', 'fills', 'fontName', 'fontSize', 'hyperlink', 'letterSpacing', 'lineHeight', 'textCase', 'textDecoration', 'textStyleId'])

		const segments: TextSegment[] = []

		originSegments.forEach((segment) => {
			const textSegment = new TextSegment()
			textSegment.fillFigma(segment)
			segments.push(textSegment)	
		})

		return segments;
	}

	private getContainer = () => {
		const container: BaseSegment = {
			tag: 'div',
			// TODO: support container className
			className: '',
			style: calcTextContainerCssStyle(this.textNode),
			children: this.getSegments()
		}

		return container
	}

	run = () => {
		return this.getContainer()
	}
}