"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const util = require("./util");
const parser = require("./parser");
const compiler = require("./compiler");
const options_1 = require("./options");
const cache = new Map();
function compile(html) {
    return {
        template: compiler.process(html),
        time: Date.now()
    };
}
function renderFile(file, data, callback) {
    util.readFile(file).then(html => {
        util.checksum(html, true).then(hash => {
            if (options_1.options.caching && !cache.get(html))
                cache.set(html, compile(html));
            const compiled = cache.get(html);
            if (compiled)
                callback(null, parser.computeParts(compiled.template, data));
            else
                callback('Error: Chache not found', '');
        });
    });
}
exports.renderFile = renderFile;
async function render(template_name, data) {
    const template_path = path.join(options_1.options.template_dir, `${template_name}.${options_1.options.template_ext}`);
    if (options_1.options.caching && !cache.get(template_name)) {
        const html = await util.readFile(template_path);
        if (html !== undefined)
            cache.set(template_name, compile(html));
        else {
            'No file found'.log();
            return '';
        }
    }
    const compiled = cache.get(template_name);
    if (compiled)
        return parser.computeParts(compiled.template, data);
    else
        return '';
}
exports.render = render;
exports._express = renderFile;
