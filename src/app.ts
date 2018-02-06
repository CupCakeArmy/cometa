import * as path from 'path'
import * as util from './util'
import * as parser from './parser'
import * as compiler from './compiler'
import { Compiled, LOG_TYPE, options } from './options'

const cache: Map<string, Compiled> = new Map()

function logger(type: LOG_TYPE, msg: object | string): void {
	if (typeof msg === 'object')
		msg = JSON.stringify(msg)

	let typeString: string = ''

	switch (type) {
		case LOG_TYPE.Info:
			typeString = 'Info'
			break
		case LOG_TYPE.Warning:
			typeString = 'Warning'
			break
		case LOG_TYPE.Error:
			typeString = 'Error'
			break
	}

	console.log(`${typeString}:`, msg)
}

async function compile(html: string): Promise<Compiled> {
	return {
		template: compiler.process(html),
		hash: await util.checksum(html, true),
		time: Date.now()
	}
}

async function render(template_name: string, data?: any): Promise<string> {
	// const compiled_path = path.join(options.compiled_dir, `${template_name}.${options.compiled_ext}`)
	const template_path = path.join(options.template_dir, `${template_name}.${options.template_ext}`)

	// Compile Template if is not in cache
	if (options.caching && !cache.get(template_name)) {
		const html = await util.readFile(template_path)
		if (html !== undefined)
			cache.set(template_name, await compile(html))
		else {
			logger(LOG_TYPE.Error, 'No file found')
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

async function go() {
	const ret = await render('new', {
		arr: [{ test: true }, { test: false }]
	})

	ret.log()
}

go()