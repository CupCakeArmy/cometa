"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
function computeParts(parts, data = {}) {
    if (parts.length === 0)
        return '';
    return computePart(parts[0], data) + computeParts(parts.slice(1), data);
}
exports.computeParts = computeParts;
function computePart(part, data = {}) {
    if (options_1.isRender(part))
        return part;
    else
        return computePartFunction(part, data);
}
function computePartFunction(func, data = {}) {
    if (options_1.isRender(func))
        return func;
    else {
        const ret = func(data);
        if (options_1.isRender(ret))
            return ret;
        else
            return computeParts(ret, data);
    }
}
