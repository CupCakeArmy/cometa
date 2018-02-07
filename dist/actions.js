"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("./compiler");
const options_1 = require("./options");
const util_1 = require("./util");
const path_1 = require("path");
const parser_1 = require("./parser");
exports.comment = html => {
    const tag = options_1.re.comment + options_1.re.ending;
    const end = html.indexOf(tag);
    if (end === -1)
        throw new Error(options_1.error.parse.comment_not_closed);
    return {
        parts: [],
        length: end + tag.length
    };
};
exports.logic = html => {
    const rexp = {
        start: new RegExp(`${options_1.re.begin}\\${options_1.re.if} *\\${options_1.re.if_else}?${options_1.re.valid_variable} *${options_1.re.ending}`, 'g'),
        else: new RegExp(`${options_1.re.begin} *\\${options_1.re.if_else} *${options_1.re.ending}`, 'g'),
        end: RegExp(`${options_1.re.begin} *\\${options_1.re.closing_tag} *\\${options_1.re.if} *${options_1.re.ending}`, 'g'),
    };
    const current = {
        found: rexp.start.exec(html),
        variable: '',
        inverted: false,
    };
    if (current.found === null || current.found.index !== 0)
        throw new Error(options_1.error.parse.default);
    current.variable = current.found[0].slice(options_1.re.begin.length + options_1.re.if.length, -options_1.re.ending.length).trim();
    current.inverted = current.variable[0] === options_1.re.if_invert;
    if (current.inverted)
        current.variable = current.variable.slice(options_1.re.if_invert.length);
    let next;
    do {
        next = {
            start: rexp.start.exec(html),
            else: rexp.else.exec(html),
            end: rexp.end.exec(html),
        };
        if (next.end === null)
            throw new Error(options_1.error.parse.default);
    } while (next.start !== null && next.start.index < next.end.index);
    const body = {
        if: html.substring(current.found[0].length, next.end.index),
        else: ''
    };
    return {
        parts: [(data) => {
                const ret = util_1.getFromObject(data, current.variable);
                let isTrue = ret !== undefined && ret !== false && ret !== null && ret !== '';
                if (current.inverted)
                    isTrue = !isTrue;
                if (isTrue)
                    return compiler_1.compileBlock(body.if).parts;
                else
                    return compiler_1.compileBlock(body.else).parts;
            }],
        length: next.end.index + next.end[0].length
    };
};
exports.importer = html => {
    const end = html.indexOf(options_1.re.ending);
    if (end === -1)
        throw new Error(options_1.error.parse.include_not_closed);
    const template_name = html.substring(options_1.re.begin.length + options_1.re.incude.length, end).trim();
    const file_name = path_1.join(options_1.options.template_dir, `${template_name}.${options_1.options.template_ext}`);
    const file = util_1.readFileSync(file_name);
    return {
        parts: compiler_1.compileBlock(file).parts,
        length: end + options_1.re.ending.length
    };
};
exports.variables = html => {
    const end = html.indexOf(options_1.re.ending);
    if (end === -1)
        throw new Error(options_1.error.parse.variable_not_closed);
    const variable_name = html.substring(options_1.re.begin.length, end).trim();
    return {
        parts: [(data) => {
                const output = util_1.getFromObject(data, variable_name);
                switch (typeof output) {
                    case 'object':
                        return JSON.stringify(output);
                    default:
                        return output;
                }
            }],
        length: end + options_1.re.ending.length
    };
};
exports.loop = html => {
    const rexp = {
        start: new RegExp(`${options_1.re.begin}\\${options_1.re.for} *${options_1.re.valid_variable} *${options_1.re.for_in} *${options_1.re.valid_variable} *${options_1.re.ending}`, 'g'),
        end: RegExp(`${options_1.re.begin} *\\${options_1.re.closing_tag} *\\${options_1.re.for} *${options_1.re.ending}`, 'g'),
    };
    const current = {
        found: rexp.start.exec(html),
        variable: '',
        arr: '',
    };
    if (current.found === null || current.found.index !== 0)
        throw new Error(options_1.error.parse.default);
    const statement = current.found[0].slice(options_1.re.begin.length + options_1.re.if.length, -options_1.re.ending.length).trim().split(options_1.re.for_in);
    current.variable = statement[0].trim();
    current.arr = statement[1].trim();
    let next;
    do {
        next = {
            start: rexp.start.exec(html),
            end: rexp.end.exec(html),
        };
        if (next.end === null)
            throw new Error(options_1.error.parse.default);
    } while (next.start !== null && next.start.index < next.end.index);
    html = html.substring(current.found[0].length, next.end.index);
    return {
        parts: [(data) => {
                let ret = '';
                for (const variable of util_1.getFromObject(data, current.arr)) {
                    const newData = Object.assign({ [current.variable]: variable }, data);
                    ret += parser_1.computeParts(compiler_1.compileBlock(html).parts, newData);
                }
                return ret;
            }],
        length: next.end.index + next.end[0].length
    };
};
