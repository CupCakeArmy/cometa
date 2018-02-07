"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const crypto = require("crypto");
String.prototype.log = function () {
    console.log(this);
};
function readFile(url) {
    return new Promise(res => {
        fs.readFile(url, (err, data) => {
            if (err)
                throw new Error(`No such file: ${url}`);
            else
                res(data.toString());
        });
    });
}
exports.readFile = readFile;
function readFileSync(url) {
    return fs.readFileSync(url).toString();
}
exports.readFileSync = readFileSync;
function writeFile(url, data) {
    return new Promise(res => {
        fs.writeFile(url, data, err => {
            if (err)
                res(false);
            res(true);
        });
    });
}
exports.writeFile = writeFile;
function writeFileSync(url, data) {
    fs.writeFileSync(url, data);
}
exports.writeFileSync = writeFileSync;
function fileExists(url) {
    return new Promise(res => {
        fs.exists(url, _ => {
            res(_);
        });
    });
}
exports.fileExists = fileExists;
function checksum(url, plain = false, alg = 'sha1') {
    return new Promise(res => {
        const hash = crypto.createHash(alg);
        if (plain) {
            res(hash.update(url).digest('hex'));
        }
        else {
            const stream = fs.createReadStream(url);
            stream.on('data', data => hash.update(data, 'utf8'));
            stream.on('end', _ => { res(hash.digest('hex')); });
        }
    });
}
exports.checksum = checksum;
function replaceBetween(start, end, str, replace) {
    return str.substring(0, start) + replace + str.substring(end);
}
exports.replaceBetween = replaceBetween;
function getFromObject(data, name) {
    name = name.trim();
    const valid = /^[A-z]\w*(\.[A-z]\w*|\[\d+\]|\[('|")\w+\2\]|\[[A-z]\w*\])*$/.test(name);
    if (!valid)
        return '';
    name = name.replace(/('|")/g, '');
    name = name.replace(/\[(\w+)\]/g, '.$1');
    for (const i of name.split('.'))
        data = data[i];
    return data;
}
exports.getFromObject = getFromObject;
