import { re, error } from "./options";
import { readFile } from "./util";
import * as path from 'path'
import { options } from './options'

function getFromData(data: any, name: string): string {

	name = name.trim()

	// If not matches the valid pattern of a getter, return empty string
	const valid: boolean = /^[A-z]\w*(\.[A-z]\w*|\[\d+\]|\[('|")\w+\2\]|\[[A-z]\w*\])*$/.test(name)
	if (!valid)
		return ''

	name = name.replace(/('|")/g, '')
	name = name.replace(/\[(\w+)\]/g, '.$1')

	for (const i of name.split('.'))
		data = data[i]

	return String(data)
}

function replaceBetween(start: number, end: number, str: string, replace: string): string {
	return str.substring(0, start) + replace + str.substring(end)
}

export async function insertImports(html: string, depth = 0): Promise<string> {
	if (depth > options.max_recursion)
		throw new Error('Maximal recursion in include statement')

	const begin = re.begin + re.incude
	const ending = re.ending

	const exp = new RegExp(`${begin}.*?${ending}`, 'g')

	const includes = html.match(exp)
	if (includes !== null)
		for (const i of includes) {
			const template_name = i.slice(begin.length, -ending.length).trim()
			const file = await readFile(path.join(options.template_dir, `${template_name}.${options.template_ext}`))
			const render = await insertImports(file, ++depth)
			html = html.replace(i, render)
		}

	return html

}

export function addParts(data: any, parts: (((data: any) => string) | string)[]): string {
	if (parts.length === 0) return ''

	const part: string | ((data: any) => string) = parts[0]

	return (typeof part === 'string' ? part : part(data)) + addParts(data, parts.slice(1))
}

export function removeComments(html: string): string {
	return html.replace(
		new RegExp(`${re.begin}${re.comment}(.|\n)*?${re.comment}${re.ending}`, 'g'), '')
}

export function replaceVars(html: string): (((data: any) => string) | string)[] {

	const begin = new RegExp(re.begin)
	const ending = new RegExp(re.ending)

	const ret: (((data: any) => string) | string)[] = []

	let i = html.match(begin) // Starting char
	while (i !== null) {
		if (i.index === undefined)
			throw new Error(error.parse)

		// Push text before
		ret.push(html.substr(0, i.index))

		html = html.slice(i.index + i[0].length)

		// Get closing tag
		const j = html.match(ending)
		if (j === null || j.index === undefined)
			throw new Error(error.parse)

		const sub: string = html.substring(0, j.index)

		ret.push((data) => {
			return getFromData(data, sub)
		})

		html = html.slice(j.index + j[0].length)

		i = html.match(begin) // Starting char
	}

	ret.push(html)

	return ret
}