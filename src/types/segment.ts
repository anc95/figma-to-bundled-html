export interface BaseSegment {
	className?: string,
  tag: string,
  style?: Record<string, string>,
  children?: BaseSegment[]
  attributes?: Record<string, string>

  renderattributes: () => string
}