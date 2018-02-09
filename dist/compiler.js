"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
const actions = require("./actions");
exports.compileBlock = (part, optoins, re) => {
    const rexp = Object.freeze({
        begin: new RegExp(re.begin, 'g'),
        end: new RegExp(re.ending, 'g'),
    });
    let next;
    const getNext = (s) => Object.freeze({
        start: s.search(rexp.begin),
        end: s.search(rexp.end),
    });
    let ret = {
        parts: [],
        length: NaN
    };
    function addToRet(item) {
        ret.parts = ret.parts.concat(item);
    }
    next = getNext(part);
    while (next.start !== -1) {
        if (next.start === null || next.end === null)
            throw new Error(options_1.error.parse.default);
        addToRet(part.substr(0, next.start));
        part = part.slice(next.start);
        let func;
        switch (part[re.begin.length]) {
            case re.comment:
                func = actions.comment;
                break;
            case re.if:
                func = actions.logic;
                break;
            case re.for:
                func = actions.loop;
                break;
            case re.incude:
                func = actions.importer;
                break;
            default:
                func = actions.variables;
                break;
        }
        const result = func(part, options_1.options, re);
        addToRet(result.parts);
        part = part.slice(result.length);
        next = getNext(part);
    }
    addToRet(part);
    return ret;
};
function process(html, options, re) {
    const parts = exports.compileBlock(html, options, re).parts;
    return parts;
}
exports.process = process;
