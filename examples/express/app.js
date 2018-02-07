import * as express from 'express'

const app = express()

app.set('views', './views')
app.set('view engine', 'blitz')
app.engine('blitz', require('./src/blitz')._express)

app.get('/', (req, res) => {
	res.render('new', {
		myVar: 'whuup whuup',
		arr: [{
			test: true
		}, {
			test: false
		}],
	})
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))