const Cometa = require('../../dist/cometa.js')
const cometa = new Cometa()

const template = 'index'
const data = {
	name: 'World'
}
const callback = (err, html) => {
	if (err)
		console.log(err)
	else
		console.log(html)
}

cometa.renderTemplate(template, data, callback)