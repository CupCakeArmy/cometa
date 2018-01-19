export const enum LOG_TYPE {
	Info,
	Warning,
	Error,
}

export interface Render {
	do: ((data: any) => string)
	hash: string
	time: number
}

export interface Error {
	parse: string
}

export const error: Error = {
	parse: 'Parse Error.'
}

interface Options {
	encoding: string
	caching: boolean
	template_dir: string
	template_ext: string
	compiled_dir: string
	compiled_ext: string
}

export const options: Options = {
	encoding: 'utf-8',
	caching: true,
	template_dir: './views',
	template_ext: 'html',
	compiled_dir: './views',
	compiled_ext: 'htmlbin',
}

interface Expressions {
	begin: string
	ending: string
	comment: string
	incude: string
	if: string
	if_else: string
	for: string
	for_in: string
}

export const re: Expressions = {
	begin: '{{',
	ending: '}}',
	comment: '#',
	incude: '>',
	if: '?',
	if_else: '!',
	for: '*',
	for_in: 'in',
}