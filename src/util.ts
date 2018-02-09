import * as fs from 'fs'
import * as crypto from 'crypto'

export function readFile(url: string): Promise<string> {
	return new Promise(res => {
		fs.readFile(url, (err, data) => {
			if (err)
				res()
			else
				res(data.toString())
		})
	})
}

export function readFileSync(url: string): string {
	return fs.readFileSync(url).toString()
}

export function fileExists(url: string): Promise<boolean> {
	return new Promise(res => {
		fs.exists(url, _ => {
			res(_)
		})
	})
}

export function checksum(url: string, plain = false, alg = 'sha1'): Promise<string> {
	return new Promise(res => {
		const hash = crypto.createHash(alg)

		if (plain) {
			res(hash.update(url).digest('hex'))
		}
		else {
			// For large files
			const stream = fs.createReadStream(url)
			stream.on('data', data => hash.update(data, 'utf8'))
			stream.on('end', _ => { res(hash.digest('hex')) })
		}
	})
}

export function getFromObject(data: any, name: string): any {

	name = name.trim()

	// If not matches the valid pattern of a getter, return empty string
	const valid: boolean = /^[A-z]\w*(\.[A-z]\w*|\[\d+\]|\[('|")\w+\2\]|\[[A-z]\w*\])*$/.test(name)
	if (!valid)
		return ''

	name = name.replace(/('|")/g, '')
	name = name.replace(/\[(\w+)\]/g, '.$1')
	try {
		for (const i of name.split('.'))
			data = data[i]
	} catch (e) {
		return ''
	}
	return data
}