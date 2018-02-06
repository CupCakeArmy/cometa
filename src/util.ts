import * as fs from 'fs'
import * as crypto from 'crypto'

declare global {
	interface String {
		log: () => void
	}
}

String.prototype.log = function (): void {
	console.log(this)
}

export function readFile(url: string): Promise<string> {
	return new Promise(res => {
		fs.readFile(url, (err, data) => {
			if (err)
				throw new Error(`No such file: ${url}`)
			else
				res(data.toString())
		})
	})
}

export function readFileSync(url: string): string {
	return fs.readFileSync(url).toString()
}

export function writeFile(url: string, data: any): Promise<boolean> {
	return new Promise(res => {
		fs.writeFile(url, data, err => {
			if (err)
				res(false)
			res(true)
		})

	})
}

export function writeFileSync(url: string, data: any): void {
	fs.writeFileSync(url, data)
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
			const stream = fs.createReadStream(url)
			stream.on('data', data => hash.update(data, 'utf8'))
			stream.on('end', _ => { res(hash.digest('hex')) })
		}
	})
}

export function replaceBetween(start: number, end: number, str: string, replace: string): string {
	return str.substring(0, start) + replace + str.substring(end)
}

export function getFromObject(data: any, name: string): any {

	name = name.trim()

	// If not matches the valid pattern of a getter, return empty string
	const valid: boolean = /^[A-z]\w*(\.[A-z]\w*|\[\d+\]|\[('|")\w+\2\]|\[[A-z]\w*\])*$/.test(name)
	if (!valid)
		return ''

	name = name.replace(/('|")/g, '')
	name = name.replace(/\[(\w+)\]/g, '.$1')

	for (const i of name.split('.'))
		data = data[i]

	return data
}