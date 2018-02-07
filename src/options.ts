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

export type ActionFunction = (part: Render) => ActionReturn

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

interface Options {
	encoding: string
	caching: boolean
	template_dir: string
	template_ext: string
	compiled_dir: string
	compiled_ext: string
	max_recursion: number
}

export const options: Options = {
	encoding: 'utf-8',
	caching: true,
	template_dir: './views',
	template_ext: 'html',
	compiled_dir: './cache',
	compiled_ext: 'bjs',
	max_recursion: 100,
}

interface Expressions {
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
	valid_variable: '[A-z](\\w|\\.)*?',
}