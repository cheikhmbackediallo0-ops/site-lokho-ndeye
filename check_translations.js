const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const translationsCode = fs.readFileSync('translations.js', 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(translationsCode, sandbox);
const dictEn = sandbox.window.i18nTranslations.en;
const dictFr = sandbox.window.i18nTranslations.fr;

console.log('FR keys count:', Object.keys(dictFr).length);
console.log('EN keys count:', Object.keys(dictEn).length);

const missingInEn = Object.keys(dictFr).filter(k => dictEn[k] === undefined);
console.log('Keys in FR missing in EN:', missingInEn);

const attrRegex = /data-i18n(?:-html|-placeholder|-aria|-title)?=["']([^"']+)["']/g;
const usedKeys = [];
let match;
while ((match = attrRegex.exec(html)) !== null) {
  usedKeys.push(match[1]);
}
const uniqueUsedKeys = [...new Set(usedKeys)];
console.log('Unique data-i18n keys used in index.html:', uniqueUsedKeys.length);

const keysMissingInTranslations = uniqueUsedKeys.filter(k => dictEn[k] === undefined && dictFr[k] === undefined);
console.log('Keys in HTML missing in translations:', keysMissingInTranslations);

const keysMissingInEnOnly = uniqueUsedKeys.filter(k => dictEn[k] === undefined);
console.log('Keys in HTML missing in EN:', keysMissingInEnOnly);
