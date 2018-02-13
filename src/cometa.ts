import * as path from 'path'
import * as util from './util'
import * as parser from './parser'
import * as compiler from './compiler'
import { Compiled, options, Options, Expressions, re } from './options'

type RenderCallback = (err: any, render: string) => void

interface Env {
	options: Options
	expressions: Expressions
	cache: Map<string, Compiled>
}

module.exports = class Cometa {
	cache: Map<string, Compiled> = new Map()
	options: Options
	expressions: Expressions

	private static permCache: Map<string, Compiled>

	constructor(opt?: Options, rexp?: Expressions) {

		this.options = Object.assign(options, opt)
		this.expressions = Object.assign(re, rexp)

		if (module.parent === null)
			throw new Error('Not imported')

		this.options.views = path.join(path.dirname(module.parent.filename), this.options.views)
	}

	private static exec(file: string, data: any, callback: RenderCallback, env: Env): void {
		util.readFile(file).then(html => {
			if (html === undefined) {
				callback(`No template found: ${file}`, '')
				return
			}
			util.checksum(html, true).then(hash => {
				// Compile Template if is not in cache
				if (env.options.caching && !env.cache.get(html)) {
					process.stdout.write(`Compiling: ${hash}\n`)
					env.cache.set(html, {
						template: compiler.process(html, env.options, env.expressions),
						time: Date.now()
					})
				}

				// Render the template and return the html
				const compiled = env.cache.get(html)
				if (compiled)
					callback(null, parser.computeParts(compiled.template, data))
				else
					callback('Error: Chache not found', '')
			})
		})
	}

	render(template_name: string, data: any, callback: RenderCallback): void {
		const template_path = path.join(this.options.views, `${template_name}.${this.options.extension}`)
		this.renderFile(template_path, data, callback)
	}

	renderFile(template_path: string, data: any, callback: RenderCallback): void {
		Cometa.exec(template_path, data, callback, {
			options: this.options,
			expressions: this.expressions,
			cache: this.cache
		})
	}

	static __express(file: string, data: any, callback: RenderCallback) {
		if (Cometa.permCache === undefined) {
			process.stdout.write('Initializing cache map\n')
			Cometa.permCache = new Map()
		}

		Cometa.exec(file, data, callback, {
			options: options,
			expressions: re,
			cache: Cometa.permCache,
		})
	}

}