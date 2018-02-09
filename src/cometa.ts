import * as path from 'path'
import * as util from './util'
import * as parser from './parser'
import * as compiler from './compiler'
import { Compiled, options, Options, Expressions, re } from './options'

module.exports = class {
	private cache: Map<string, Compiled>
	private options: Options = options
	private expressions: Expressions = re

	constructor(opt?: Options, rexp?: Expressions) {
		this.cache = new Map()

		this.options = Object.assign(this.options, opt)
		this.expressions = Object.assign(this.expressions, rexp)

		if (module.parent === null)
			throw new Error('Not imported')

		this.options.views = path.join(path.dirname(module.parent.filename), this.options.views)
	}

	renderFile(file: string, data: any, callback: (err: any, render: string) => void): void {
		console.log('Options', this.options)
		util.readFile(file).then(html => {
			console.log('Options', this.options)
			if (html === undefined) {
				callback(`No template found: ${file}`, '')
				return
			}
			util.checksum(html, true).then(hash => {
				// Compile Template if is not in cache
				if (this.options.caching && !this.cache.get(html))
					this.cache.set(html, {
						template: compiler.process(html, this.options, this.expressions),
						time: Date.now()
					})

				// Render the template and return the html
				const compiled = this.cache.get(html)
				if (compiled)
					callback(null, parser.computeParts(compiled.template, data))
				else
					callback('Error: Chache not found', '')
			})
		})
	}

	renderTemplate(template_name: string, data: any, callback: (err: any, render: string) => void): void {
		const template_path = path.join(this.options.views, `${template_name}.${this.options.extension}`)
		this.renderFile(template_path, data, callback)
	}

	_express = this.renderFile

}