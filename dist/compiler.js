"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
const actions = require("./actions");
const rexp = Object.freeze({
    begin: new RegExp(options_1.re.begin, 'g'),
    end: new RegExp(options_1.re.ending, 'g'),
});
exports.compileBlock = part => {
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
        switch (part[options_1.re.begin.length]) {
            case options_1.re.comment:
                func = actions.comment;
                break;
            case options_1.re.if:
                func = actions.logic;
                break;
            case options_1.re.for:
                func = actions.loop;
                break;
            case options_1.re.incude:
                func = actions.importer;
                break;
            default:
                func = actions.variables;
                break;
        }
        const result = func(part);
        addToRet(result.parts);
        part = part.slice(result.length);
        next = getNext(part);
    }
    addToRet(part);
    return ret;
};
function process(html, options = {}) {
    const parts = exports.compileBlock(html).parts;
    return parts;
}
exports.process = process;
