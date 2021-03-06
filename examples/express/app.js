const express = require('express')
const app = express()

app.set('views', `${__dirname}/views`)
app.set('view engine', 'html')
app.engine('html', require('cometa').__express)

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Cometa!',
		arr: [{
			show: true,
			msg: 'Show meee',
		}, {
			show: false,
			msg: 'I\'m hidden :(',
		}, {
			show: true,
			msg: 'I\'m super',
			comments: [
				'Amazing!',
				'No way?'
			]
		}],
	})
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))