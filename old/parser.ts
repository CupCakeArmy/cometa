import { re, PartFunction, Part, Render, isRender, options } from '../options'
import { readFile } from '../util'
import * as path from 'path'
import * as actions_old from './actions'

export function getFromData(data: any, name: string): string {

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

export function dereduce(parts: Part[], func: ((part: Part) => Part[] | Part)): Part[] {

	if (parts.length === 0)
		return []

	let ret = func(parts[0])
	if (!Array.isArray(ret))
		ret = [ret]
	return ret.concat(dereduce(parts.slice(1), func))

}

export function doActions(parts: Part[] | Part): Part[] {

	const start_time = Date.now()

	if (!Array.isArray(parts))
		parts = [parts]

	const action_funcs = [actions_old.comment, actions_old.importer]
	for (const action of action_funcs) {
		parts = action(parts)
	}

	console.log(`Rendered in ${Date.now() - start_time}ms`)
	return parts
}

export function computeParts(parts: Part[], data = {}): Render {
	if (parts.length === 0)
		return ''

	return computePart(parts[0], data) + computeParts(parts.slice(1), data)
}

function computePart(part: Part, data = {}): Render {
	if (isRender(part))
		return part
	else
		return computePartFunction(part, data)
}

function computePartFunction(func: PartFunction, data = {}): Render {
	if (isRender(func))
		return func;
	else {
		const ret = func(data)
		if (isRender(ret))
			return ret
		else return computeParts(ret, data)
		// return computePart(, data)
	}
}