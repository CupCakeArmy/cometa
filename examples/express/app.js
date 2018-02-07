const express = require('express')
const app = express()

app.set('views', './views')
app.set('view engine', 'blitz')
app.engine('blitz', require('cometa')._express)

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