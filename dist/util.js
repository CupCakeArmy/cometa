"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const crypto = require("crypto");
function readFile(url) {
    return new Promise(res => {
        fs.readFile(url, (err, data) => {
            if (err)
                res();
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
function getFromObject(data, name) {
    name = name.trim();
    const valid = /^[A-z]\w*(\.[A-z]\w*|\[\d+\]|\[('|")\w+\2\]|\[[A-z]\w*\])*$/.test(name);
    if (!valid)
        return '';
    name = name.replace(/('|")/g, '');
    name = name.replace(/\[(\w+)\]/g, '.$1');
    try {
        for (const i of name.split('.'))
            data = data[i];
    }
    catch (e) {
        return '';
    }
    return data;
}
exports.getFromObject = getFromObject;
