"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRender(obj) {
    return typeof obj === 'string';
}
exports.isRender = isRender;
exports.error = {
    parse: {
        default: 'Parse Error.',
        import_recursion: 'Maximal recusion achieved in import module',
        not_supported: 'Not supported yet',
        comment_not_closed: 'Comment was not closed properly',
        variable_not_closed: 'Variable was not closed properly',
        include_not_closed: 'Include not closed',
    },
};
exports.options = {
    encoding: 'utf-8',
    caching: true,
    template_dir: './views',
    template_ext: 'html',
    compiled_dir: './cache',
    compiled_ext: 'bjs',
    max_recursion: 100,
};
exports.re = {
    begin: '{{',
    ending: '}}',
    comment: '#',
    incude: '>',
    if: '?',
    if_else: '!',
    if_invert: '!',
    for: '*',
    for_in: 'in',
    closing_tag: '/',
    valid_variable: '[A-z](\\w|\\.)*?',
};
