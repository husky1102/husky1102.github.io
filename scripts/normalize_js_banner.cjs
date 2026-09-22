// Preserve license wording while removing trailing spaces within banner comments.
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(__dirname, '../assets/js/home-motion.min.js');
const source = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, source.replace(/\/\*![\s\S]*?\*\//g, comment => comment.replace(/[ \t]+$/gm, '')));
