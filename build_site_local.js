const fs = require('fs');
const path = require('path');

const dir = __dirname;
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const translations = fs.readFileSync(path.join(dir, 'translations.js'), 'utf8');
const script = fs.readFileSync(path.join(dir, 'script.js'), 'utf8');

// Replace CSS link with inline style
html = html.replace(
  /<link rel="stylesheet" href="style\.css[^"]*">/,
  `<style>\n${css}\n</style>`
);

// Replace scripts with inline script containing translations and script
html = html.replace(
  '<script src="translations.js"></script>\n  <script src="script.js"></script>',
  `<script>\n${translations}\n\n${script}\n</script>`
);

// If CRLF variation
html = html.replace(
  '<script src="translations.js"></script>\r\n  <script src="script.js"></script>',
  `<script>\n${translations}\n\n${script}\n</script>`
);

fs.writeFileSync(path.join(dir, 'site-local.html'), html, 'utf8');
console.log('site-local.html successfully synchronized with index.html, translations.js, and script.js!');
