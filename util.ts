import * as fs from 'fs'
import * as crypto from 'crypto'

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

export function exists(url: string): Promise<boolean> {
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