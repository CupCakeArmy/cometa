"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const util = require("./util");
const parser = require("./parser");
const compiler = require("./compiler");
const options_1 = require("./options");
module.exports = class {
    constructor(opt, rexp) {
        this.options = options_1.options;
        this.expressions = options_1.re;
        this._express = this.renderFile;
        this.cache = new Map();
        this.options = Object.assign(this.options, opt);
        this.expressions = Object.assign(this.expressions, rexp);
        if (module.parent === null)
            throw new Error('Not imported');
        this.options.views = path.join(path.dirname(module.parent.filename), this.options.views);
    }
    renderFile(file, data, callback) {
        console.log('Options', this.options);
        util.readFile(file).then(html => {
            console.log('Options', this.options);
            if (html === undefined) {
                callback(`No template found: ${file}`, '');
                return;
            }
            util.checksum(html, true).then(hash => {
                if (this.options.caching && !this.cache.get(html))
                    this.cache.set(html, {
                        template: compiler.process(html, this.options, this.expressions),
                        time: Date.now()
                    });
                const compiled = this.cache.get(html);
                if (compiled)
                    callback(null, parser.computeParts(compiled.template, data));
                else
                    callback('Error: Chache not found', '');
            });
        });
    }
    renderTemplate(template_name, data, callback) {
        const template_path = path.join(this.options.views, `${template_name}.${this.options.extension}`);
        this.renderFile(template_path, data, callback);
    }
};
