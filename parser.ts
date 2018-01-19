import { re, error } from "./options";

function getFromData(data: any, name: string): string {
	let ret: any = data
	for (let i of name.trim().split('.')) {
		const array = i.match(/\[\w+\]/)
		if (array === null)
			ret = ret[i]
		else {
			const index: string = array[0].slice(1, -1)
			const num_index: number = parseInt(index[0])
			ret = ret[i.substr(0, array.index)]
			ret = num_index === NaN ? ret[index] : ret[num_index]
		}
	}
	return ret
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

	const ret: (((data: any) => string) | string)[] = []

	let i = html.match(/{{/) // Starting char
	while (i !== null) {
		if (i.index === undefined)
			throw new Error(error.parse)

		// Push text before
		ret.push(html.substr(0, i.index))

		html = html.slice(i.index + i[0].length)

		// Get closing tag
		const j = html.match(/}}/)
		if (j === null || j.index === undefined)
			throw new Error(error.parse)

		const sub: string = html.substring(0, j.index)

		ret.push((data) => {
			return getFromData(data, sub)
		})

		html = html.slice(j.index + j[0].length)

		i = html.match(/{{/) // Starting char
	}

	ret.push(html)

	return ret
}