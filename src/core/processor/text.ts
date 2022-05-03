import { BaseSegment } from '@/types/segment'
import { calcTextNodeCssStyle } from '@/utils/style'
import { TextSegment, BrSegment } from '@/core/segments'
import { useContext } from '../context'

export class TextProcessor {
	private textNode: TextNode

	constructor(textNode: TextNode) {
		this.textNode = textNode
	}

	private getSegments = async () => {
		const originSegments = this.textNode.getStyledTextSegments(['fillStyleId', 'fills', 'fontName', 'fontSize', 'hyperlink', 'letterSpacing', 'lineHeight', 'textCase', 'textDecoration', 'textStyleId', 'listOptions'])

		const segments: (TextSegment | BrSegment)[] = []
		let inOl = false
		let inLi = false
		let olContainer: any = []
		const context = useContext()

		const task = async (list: any[], index: number) => {
			if (index > originSegments.length - 1) {
				return
			}

			const segment = originSegments[index]
			const textSegment = new TextSegment()

			await textSegment.fillFigma(segment)

			context.textKeys.add(textSegment.text)

			const appendBr = () => {
				let appended = false;

				for (const char of textSegment.text) {
					if (char === '\n') {
						list.push(new BrSegment())
						appended = true
					}
				}

				return appended
			}

			if (segment.listOptions.type && segment.listOptions.type !== 'NONE') {
				if (inLi) {
					list.push(textSegment)

					if (appendBr()) {
						inLi = false
						await task(olContainer, index + 1)
					} else {
						await task(list, index + 1)
					}
				} else if (inOl) {
					const li = {
						tag: 'li',
						style: {
							display: 'list-item'
						},
						className: '',
						children: [textSegment]
					}
					olContainer.push(li)
					appendBr()
					inLi = true
					await task(li.children, index + 1)
				} else {
					const li = {
						tag: 'li',
						style: {
							display: 'list-item'
						},
						className: '',
						children: [textSegment]
					}

					const ol = {
						tag: segment.listOptions.type === 'ORDERED' ? 'ol' : 'ul',
						className: '',
						style: {},
						children: [li]
					}

					olContainer = ol.children
					inOl = true
					inLi = true
					list.push(ol)
					appendBr()
					await task(li.children, index + 1)
				}
			} else {
				list.push(textSegment)
				appendBr()
				await task(list, index + 1)
			}
		}

		await task(segments, 0)
		return segments;
	}

	private getContainer = async () => {
		const container: BaseSegment = {
			tag: 'div',
			// TODO: support container className
			className: '',
			style: await calcTextNodeCssStyle(this.textNode),
			children: await this.getSegments()
		}

		return container
	}

	run = () => {
		return this.getContainer()
	}
}