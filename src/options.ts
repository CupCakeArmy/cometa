export const enum LOG_TYPE {
	Info,
	Warning,
	Error,
}

export function isRender(obj: any): obj is Render {
	return typeof obj === 'string'
}

export type Render = string
export type Part = (PartFunction | Render)
export type PartFunction = (data: any) => (Part[] | Render)

export interface ActionReturn {
	parts: Part[]
	length: number
}

export type ActionFunction = (part: Render, options: Options, re: Expressions) => ActionReturn

export interface Compiled {
	template: Part[]
	time: number
}

export const error = {
	parse: {
		default: 'Parse Error.',
		import_recursion: 'Maximal recusion achieved in import module',
		not_supported: 'Not supported yet',
		comment_not_closed: 'Comment was not closed properly',
		variable_not_closed: 'Variable was not closed properly',
		include_not_closed: 'Include not closed',
	},

}

export interface Options {
	encoding: string
	caching: boolean
	views: string
	extension: string
}

export const options: Options = {
	encoding: 'utf-8',
	caching: true,
	views: './views',
	extension: 'html',
}

export interface Expressions {
	begin: string
	ending: string
	comment: string
	incude: string
	if: string
	if_else: string
	if_invert: string
	for: string
	for_in: string
	closing_tag: string
	valid_variable: string
}

export const re: Expressions = {
	begin: '{{',
	ending: '}}',
	comment: '#',
	incude: '>',
	if: '?',
	if_else: '!',
	if_invert: '!',
	for: '*',
	for_in: 'in',
	closing_tag: '/',
	valid_variable: '[A-z](\\w|\\.|\\[|\\])*?',
}