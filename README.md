# Cometa

[![Build Status](https://travis-ci.org/CupCakeArmy/cometa.svg?branch=master)](https://travis-ci.org/CupCakeArmy/cometa)

> Yet another templating engine 📠

Cometa is a templating engine with **no dependencies** written in `JS`. That was the reason it was created.

## Quickstart 💥

```bash
# Go to examples
cd examples/simple

# Install
npm i

# Run
node app.js
```

## Setup 🏗

### General Import

```javascript
// Import
const Cometa = require('cometa')

// Initialize
const cometa = new Cometa()
```

### Constructor parameters

- `views` [Optional] Root template folder
- `extension` [Optional] File extension for the templates
- `encoding` [Optional] Encoding to be used on the

```javascript
new Cometa({
	views: './my/views/folder',
	extension: 'html'
})
```

## Installation 🚂

```bash
npm i cometa
```

## Run 🚀

### Constructor Options

```javascript
new Cometa(options, expressions)
```

All options and expressions are **optional**.

- `options` (`default`) description

#### Options

- `views` (`./views`) Root template folder
- `extension` (`html`) File extension of the templates
- `encoding` (`utf-8`) Encoding of the files

#### Expressions

- `begin` (`{{`) Opening tags
- `ending` (`}}`) Closing tags
- `comment` (`#`) Comment char
- `incude` (`>`) Include char
- `if` (`?`) If statement char
- `if_invert` (`!`) Invert the variable in if statement
- `for` (`*`) For char
- `for_in` (`in`) Divider between array and i
- `closing_tag` (`/`) Closing tag for ifs and loops

### Render template

```javascript
const Cometa = require('cometa')
const cometa = new Cometa()

// Data
const template = 'index' // file called index.html in ./views
const data = {name: 'World'}
const callback = (err, html) => console.log(html)

// Do the render
cometa.render(template, data, callback)
```

### Render file

```javascript
const Cometa = require('cometa')
const cometa = new Cometa()

// Data
const data = {name: 'World'}
const callback = (err, html) => console.log(html)

// Do the render
cometa.renderFile('myDir/myTemplate.myExtesion', data, callback)
```

### Express

```javascript
const express = require('express')
const app = express()

app.set('views', `${__dirname}/views`)
app.set('view engine', 'html')
app.engine('html', require('cometa').__express)

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Cometa!'
	})
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```

## Reference 📒

### Variable

```json
{"myVar": "ok"}
```

```html
<span>{{myVar}}</span>
```

### Comments

```html
<div>
	{{# Me Me Comment #}}
</div>
```

### If

True is everything that is different from:

- `undefined`
- `false`
- `null`
- `''`

```json
{
	"myVar": "something",
	"myVar": true,
	"myVar": [1,2,3],
	"myVar": 42,
}
```

```html
{{? myVar }}
	<span>Only show me when I exist: {{ myVar }}</span>
{{/?}}
```

### Loop

```json
{
	"links": [
		{"id":0, "name": "One"},
		{"id":1, "name": "Two"},
		{"id":2, "name": "Three"}
	]
}
```

```html
<ul>
	{{* link in links}}
		<li id="{{link.id}}">{{ link.name }}</li>
	{{/*}}
</ul>
```
