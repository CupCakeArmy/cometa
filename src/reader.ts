import { Part, re, error, ActionFunction, ActionReturn } from './options'
import * as actions from './actions'

const rexp = Object.freeze({
	begin: new RegExp(re.begin, 'g'),
	end: new RegExp(re.ending, 'g'),
})

interface Next {
	start: number
	end: number
}

export const compileBlock: ActionFunction = part => {

	let next: Next
	const getNext = (s: string): Next => Object.freeze({
		start: s.search(rexp.begin),
		end: s.search(rexp.end),
	})

	let ret: ActionReturn = {
		parts: [],
		length: NaN
	}

	function addToRet(item: any) {
		ret.parts = ret.parts.concat(item)
	}

	next = getNext(part)
	while (next.start !== -1) {

		if (next.start === null || next.end === null)
			throw new Error(error.parse.default)

		addToRet(part.substr(0, next.start))
		part = part.slice(next.start)

		let func: ActionFunction

		switch (part[re.begin.length]) {
			case re.comment:
				func = actions.comment
				break
			case re.if:
				func = actions.logic
				break
			// case re.for:
			// 	func = actions.loop
			// 	break
			case re.incude:
				func = actions.importer
				break
			default:
				func = actions.variables
				break
		}

		const result = func(part)
		addToRet(result.parts)
		part = part.slice(result.length)

		next = getNext(part)
	}

	addToRet(part)

	return ret
}

export function compile(html: string, options = {}): Part[] {
	const parts: Part[] = compileBlock(html).parts
	return parts

}