import { compileBlock } from './compiler'
import { ActionFunction, re, error, options, Part } from './options'
import { getFromObject, readFileSync } from './util'
import { join } from 'path'
import { computeParts } from './parser'

export const comment: ActionFunction = html => {

	const tag = re.comment + re.ending
	const end = html.indexOf(tag)

	if (end === -1) throw new Error(error.parse.comment_not_closed)

	return {
		parts: [],
		length: end + tag.length
	}
}

export const logic: ActionFunction = html => {

	const rexp = {
		start: new RegExp(`${re.begin}\\${re.if} *\\${re.if_else}?${re.valid_variable} *${re.ending}`, 'g'),
		else: new RegExp(`${re.begin} *\\${re.if_else} *${re.ending}`, 'g'),
		end: RegExp(`${re.begin} *\\${re.closing_tag} *\\${re.if} *${re.ending}`, 'g'),
	}

	// First occurence of the if statement
	const current = {
		found: rexp.start.exec(html),
		variable: '',
		inverted: false,
	}

	// If there is no starting tag for an if statement return an error
	if (current.found === null || current.found.index !== 0)
		throw new Error(error.parse.default)

	// Extract variable name from the if statemtent
	current.variable = current.found[0].slice(re.begin.length + re.if.length, -re.ending.length).trim()
	current.inverted = current.variable[0] === re.if_invert
	if (current.inverted)
		current.variable = current.variable.slice(re.if_invert.length)


	let next
	do {
		next = {
			start: rexp.start.exec(html),
			else: rexp.else.exec(html),
			end: rexp.end.exec(html),
		}

		if (next.end === null)
			throw new Error(error.parse.default)

	} while (next.start !== null && next.start.index < next.end.index)

	const body = {
		if: html.substring(current.found[0].length, next.end.index),
		else: ''
	}

	return {
		parts: [(data: any) => {
			const ret: any = getFromObject(data, current.variable)
			console.log('IF', typeof ret, ret)
			let isTrue: boolean = ret !== undefined && ret !== false && ret !== null && ret !== ''
			if (current.inverted) isTrue = !isTrue

			if (isTrue)
				return compileBlock(body.if).parts
			else
				return compileBlock(body.else).parts
		}],
		length: next.end.index + next.end[0].length
	}
}

export const importer: ActionFunction = html => {

	const end = html.indexOf(re.ending)

	if (end === -1) throw new Error(error.parse.include_not_closed)

	const template_name: string = html.substring(re.begin.length + re.incude.length, end).trim()
	const file_name: string = join(options.template_dir, `${template_name}.${options.template_ext}`)
	const file: Part = readFileSync(file_name)

	return {
		parts: compileBlock(file).parts,
		length: end + re.ending.length
	}
}

export const variables: ActionFunction = html => {

	const end = html.indexOf(re.ending)

	if (end === -1) throw new Error(error.parse.variable_not_closed)

	const variable_name = html.substring(re.begin.length, end).trim()

	return {
		parts: [(data: any) => {
			const output = getFromObject(data, variable_name)
			switch (typeof output) {
				case 'object':
					return JSON.stringify(output)
				default:
					return output
			}
		}],
		length: end + re.ending.length
	}
}

export const loop: ActionFunction = html => {

	const rexp = {
		start: new RegExp(`${re.begin}\\${re.for} *${re.valid_variable} *${re.for_in} *${re.valid_variable} *${re.ending}`, 'g'),
		end: RegExp(`${re.begin} *\\${re.closing_tag} *\\${re.for} *${re.ending}`, 'g'),
	}

	// First occurence of the if statement
	const current = {
		found: rexp.start.exec(html),
		variable: '',
		arr: '',
	}

	// If there is no starting tag for an if statement return an error
	if (current.found === null || current.found.index !== 0)
		throw new Error(error.parse.default)

	// Extract variable name from the if statemtent
	const statement = current.found[0].slice(re.begin.length + re.if.length, -re.ending.length).trim().split(re.for_in)
	current.variable = statement[0].trim()
	current.arr = statement[1].trim()

	let next
	do {
		next = {
			start: rexp.start.exec(html),
			end: rexp.end.exec(html),
		}

		if (next.end === null)
			throw new Error(error.parse.default)

	} while (next.start !== null && next.start.index < next.end.index)

	html = html.substring(current.found[0].length, next.end.index)

	return {
		parts: [(data: any) => {
			let ret = ''
			for (const variable of getFromObject(data, current.arr)) {
				const newData = Object.assign({ [current.variable]: variable }, data)
				ret += computeParts(compileBlock(html).parts, newData)
			}
			return ret
		}],
		length: next.end.index + next.end[0].length
	}
}