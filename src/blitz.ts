import * as path from 'path'
import * as util from './util'
import * as parser from './parser'
import * as compiler from './compiler'
import { Compiled, options } from './options'

const cache: Map<string, Compiled> = new Map()

function compile(html: string): Compiled {
	return {
		template: compiler.process(html),
		time: Date.now()
	}
}

export function renderFile(file: string, data: any, callback: (err: any, render: string) => void): void {
	util.readFile(file).then(html => {
		util.checksum(html, true).then(hash => {
			// Compile Template if is not in cache
			if (options.caching && !cache.get(html))
				cache.set(html, compile(html))

			// Render the template and return the html
			const compiled = cache.get(html)
			if (compiled)
				callback(null, parser.computeParts(compiled.template, data))
			else
				callback('Error: Chache not found', '')
		})
	})
}

export async function render(template_name: string, data?: any): Promise<string> {
	const template_path = path.join(options.template_dir, `${template_name}.${options.template_ext}`)

	// Compile Template if is not in cache
	if (options.caching && !cache.get(template_name)) {
		const html = await util.readFile(template_path)
		if (html !== undefined)
			cache.set(template_name, compile(html))
		else {
			'No file found'.log()
			return ''
		}
	}

	// Render the template and return the html
	const compiled = cache.get(template_name)
	if (compiled)
		return parser.computeParts(compiled.template, data)
	else
		return ''
}

export const _express = renderFile