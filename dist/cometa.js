"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const util = require("./util");
const parser = require("./parser");
const compiler = require("./compiler");
const options_1 = require("./options");
module.exports = class Cometa {
    constructor(opt, rexp) {
        this.cache = new Map();
        this.options = Object.assign(options_1.options, opt);
        this.expressions = Object.assign(options_1.re, rexp);
        if (module.parent === null)
            throw new Error('Not imported');
        this.options.views = path.join(path.dirname(module.parent.filename), this.options.views);
    }
    static exec(file, data, callback, env) {
        util.readFile(file).then(html => {
            if (html === undefined) {
                callback(`No template found: ${file}`, '');
                return;
            }
            util.checksum(html, true).then(hash => {
                if (env.options.caching && !env.cache.get(html)) {
                    process.stdout.write(`Compiling: ${hash}\n`);
                    env.cache.set(html, {
                        template: compiler.process(html, env.options, env.expressions),
                        time: Date.now()
                    });
                }
                const compiled = env.cache.get(html);
                if (compiled)
                    callback(null, parser.computeParts(compiled.template, data));
                else
                    callback('Error: Chache not found', '');
            });
        });
    }
    render(template_name, data, callback) {
        const template_path = path.join(this.options.views, `${template_name}.${this.options.extension}`);
        this.renderFile(template_path, data, callback);
    }
    renderFile(template_path, data, callback) {
        Cometa.exec(template_path, data, callback, {
            options: this.options,
            expressions: this.expressions,
            cache: this.cache
        });
    }
    static __express(file, data, callback) {
        if (Cometa.permCache === undefined) {
            process.stdout.write('Initializing cache map\n');
            Cometa.permCache = new Map();
        }
        Cometa.exec(file, data, callback, {
            options: options_1.options,
            expressions: options_1.re,
            cache: Cometa.permCache,
        });
    }
};
