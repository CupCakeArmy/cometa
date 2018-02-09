import { Part, Render, isRender, PartFunction } from "./options";


export function computeParts(parts: Part[], data = {}): Render {
	if (parts === undefined || parts.length === 0)
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
	}
}