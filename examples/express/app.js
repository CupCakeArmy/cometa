const express = require('express')
const app = express()
const Cometa = require('../../dist/cometa')

app.set('views', './views')
app.set('view engine', 'html')
app.engine('html', new Cometa()._express)

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Cometa!',
		arr: [{
			show: true,
			msg: 'Show meee',
		}, {
			show: false,
			msg: 'I\'m hidden :(',
		}],
	})
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))