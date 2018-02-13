const Cometa = require('../../dist/cometa.js')

// Initialize
const cometa = new Cometa()

// Data
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

// Do the render
cometa.render(template, data, callback)