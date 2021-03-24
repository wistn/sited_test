#!/usr/bin/env node
/*
 * Author:wistn
 * since:2021-03-11
 * LastEditors:Do not edit
 * LastEditTime:2021-03-11
 * Description:
 */
var fs = require('fs');
var path = require('path');
var project_root = path.resolve(__dirname, '..', '..');

var text = fs
    .readFileSync(path.resolve(project_root, 'CHANGELOG.md'), 'utf-8')
    .replace(/\r\n/g, '\n');
var new_section;
var regexp = /(^|\n)(#+\s+\[?v?\d(\.\d){0,2}\]?[\s\S]*?)\n#+ \[?v?\d(\.\d){0,2}\]?/i;
if (text.match(regexp)) {
    new_section = text.match(regexp)[2];
    /* like:
        ## [2.0.0]
        'second_section'
        # v1
    */
} else {
    new_section = text.match(/(^|\n)(#+\s+\[?v?\d(\.\d){0,2}\]?[\s\S]*)$/i)[2];
    /* like:
        # Changelog
        ### 0.0.1
        'first_section'
    */
}
var version = new_section.match(/#+\s+\[?v?(\d(\.\d){0,2})\]?/i)[1];
fs.writeFileSync(
    path.resolve(path.resolve(project_root, 'new_section')),
    new_section,
    'utf-8'
);
fs.writeFileSync(
    path.resolve(path.resolve(project_root, 'version')),
    version,
    'utf-8'
);
