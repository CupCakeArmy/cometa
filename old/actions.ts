
import { dereduce, getFromData } from "./parser"
import { isRender, Part, re, options, error } from "../options"
import { readFileSync } from "../util"
import * as path from 'path'

/**
 * Removes all the comments from the html string
 * 
 * @param {string} html - HTML to be cleaned
 */
export function comment(parts: Part[]): Part[] {
    return dereduce(parts, part => {
        if (!isRender(part))
            return part

        return part.replace(new RegExp(`${re.begin}${re.comment}(.|\n)*?${re.comment}${re.ending}`, 'g'), '')
    })
}

/**
 * Inserts partials into the template
 * 
 * @param {string} html - The html to be manipulated
 * @param {number} [depth] - How deep the current recursion is
 */
export function importer(parts: Part[], depth = 0): Part[] {

    if (depth > options.max_recursion)
        throw new Error(error.parse.import_recursion)

    return dereduce(parts, part => {
        if (!isRender(part))
            return part

        const begin = re.begin + re.incude	// Beginning charachter
        const ending = re.ending			// Ending charachter	

        // All include statements in the html string
        const includes = part.match(new RegExp(`${begin}.*?${ending}`, 'g'))
        if (includes !== null)
            for (const i of includes) {

                const template_name: string = i.slice(begin.length, -ending.length).trim()
                const file_name: string = path.join(options.template_dir, `${template_name}.${options.template_ext}`)
                const file: Part = readFileSync(file_name)
                const render: Part[] = importer([file], ++depth)

                const str: Part = render[0]
                if (isRender(str))
                    part = part.replace(i, str)

            }
        return part
    })

}

export function variables(parts: Part[], depth = 0): Part[] {

    return dereduce(parts, part => {
        if (!isRender(part))
            return part

        const reg_begin = new RegExp(re.begin)
        const reg_ending = new RegExp(re.ending)

        const ret: Part[] = []

        let begin = part.match(reg_begin) // Starting char
        while (begin !== null) {
            if (begin.index === undefined)
                throw new Error(error.parse.default)

            // Push text before
            ret.push(part.substr(0, begin.index))

            part = part.slice(begin.index + begin[0].length)

            // Get closing tag
            const end = part.match(reg_ending)
            if (end === null || end.index === undefined)
                throw new Error(error.parse.default)

            const variable_name: string = part.substring(0, end.index)

            ret.push(data => getFromData(data, variable_name))

            part = part.slice(end.index + end[0].length)

            begin = part.match(reg_begin) // Starting char
        }

        ret.push(part)

        return ret
    })
}