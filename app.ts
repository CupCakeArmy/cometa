import * as fs from 'fs'
import * as path from 'path'
import * as util from './util'
import * as parser from './parser'
import { Render, LOG_TYPE, options } from './options'
import { replaceVars, addParts } from './parser';


const cache: Map<string, Render> = new Map()

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

async function compile(html: string): Promise<Render> {
	html = parser.removeComments(html)

	const compiled = replaceVars(html)

	return {
		do(data) {
			return addParts(data, compiled)
		},
		hash: await util.checksum(html, true),
		time: Date.now()
	}
}

async function render(template_name: string, data?: any): Promise<string | undefined> {
	const compiled_path = path.join(options.compiled_dir, template_name) + `.${options.compiled_dir}`

	if (!options.caching || !await util.exists(compiled_path)) {
		const template_path = path.join(options.template_dir, template_name) + `.${options.template_ext}`

		const html = await util.readFile(template_path)
		if (html === undefined) {
			logger(LOG_TYPE.Error, 'No file found')
			return
		}
		else
			cache.set(template_name, await compile(html))
	}

	const render = cache.get(template_name)
	if (render) {
		return render.do(data)
	}
	else
		return
}

async function go() {
	console.log(await render('test', {
		title: 'title',
		body: {
			p: [
				'omg',
				{
					check: 'let go'
				}
			]
		},
	}))
}

go()