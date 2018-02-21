# Cometa

[![Build Status](https://travis-ci.org/CupCakeArmy/cometa.svg?branch=master)](https://travis-ci.org/CupCakeArmy/cometa)

> Yet another templating engine 📠

Cometa is a templating engine with **no dependencies** written in `JS`. That was the reason because it was created.

## Quickstart 💥

```bash
# Install
npm i cometa

# Run
node examples/simple/app.js
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
