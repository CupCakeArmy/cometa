const assert = require('assert')
const Cometa = require('../dist/cometa')

describe('Array', function () {

	let engine
	let str

	function render(template, data) {
		return new Promise(resolve => {
			engine.render(template, data, (err, render) => {
				resolve(render)
			})
		})
	}

	function compare(a, b, msg) {
		assert.equal(a.replace(/\s/g, ''), b.replace(/\s/g, ''), msg)
	}

	before(() => {
		engine = new Cometa()
	})

	describe('Variables', () => {

		it('Simple', async () => {
			const str = 'myString'
			compare(await render('var_1', {
				myVar: str
			}), str)
		})

		it('Nested', async () => {
			const str = 'myString'
			compare(await render('var_2', {
				obj: [{
					title: str
				}]
			}), str)
		})
	})

	describe('Comment', () => {

		it('Simple', async () => {
			compare(await render('comment_1', {}), '<div></div>')
		})

		it('Multiline', async () => {
			compare(await render('comment_2', {}), '<div></div>')
		})
	})

	describe('If', () => {

		it('Simple True', async () => {
			for (const testCase of ['mystring', 0, true])
				compare(await render('if_1', {
					myVar: testCase
				}), `<span>Result: ${testCase}</span>`)
		})

		it('Simple False', async () => {
			for (const testCase of [false, '', null, undefined])
				compare(await render('if_1', {
					myVar: testCase
				}), ``)
		})

	})

	describe('Loop', () => {

		it('Simple', async () => {
			compare(
				await render('loop_1', {
					"links": [{
							"id": 0,
							"name": "One"
						},
						{
							"id": 1,
							"name": "Two"
						}
					]
				}), `
			<ul>
				<li id="0">One</li>
				<li id="1">Two</li>
			</ul>`)
		})
	})

	describe('', () => {

		it('', async () => {
			compare(
				await render('mixed_1', {
					title: 'Cometa!',
					arr: [{
						show: true,
						msg: 'a',
					}, {
						show: false,
						msg: 'b',
					}, {
						show: true,
						msg: 'c',
						comments: [
							'd',
							'e'
						]
					}],
				}),
				`
			<h1>Cometa!</h1>
			<ul>
				<li>a</li>
				<li>c
					<ul>
						<li>d</li>
						<li>e</li>
					</ul>
				</li>
			</ul>`)
		})
	})
	
})