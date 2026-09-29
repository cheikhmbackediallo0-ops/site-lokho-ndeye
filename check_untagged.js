const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split('\n');
const untagged = [];

lines.forEach((line, index) => {
  const lineNum = index + 1;
  const trimmed = line.trim();
  
  if (trimmed.startsWith('<!--') || trimmed.startsWith('<script') || trimmed.startsWith('<style') || trimmed.startsWith('<link') || trimmed.startsWith('<meta') || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<svg') || trimmed.startsWith('<path') || trimmed.startsWith('<polygon') || trimmed.startsWith('<circle') || trimmed.startsWith('<line') || trimmed.startsWith('<polyline') || trimmed.startsWith('<rect')) {
    return;
  }
  
  const textMatches = line.match(/>([^<]+)</g);
  if (textMatches) {
    for (const tm of textMatches) {
      const text = tm.replace(/[><]/g, '').trim();
      if (text.length > 2 && /[a-zA-ZÀ-ÿ]/.test(text) && !['FCFA', 'Wave', 'Wave Sénégal', 'Wave Senegal', 'Association Lokho Ndéye', 'LOKHO NDEYE', 'Saly Station [Mbour]', 'contact@lokhondeye.org', 'LN-240926'].includes(text)) {
        if (!line.includes('data-i18n') && !line.includes('data-i18n-html')) {
          untagged.push({ lineNum, text, line: trimmed });
        }
      }
    }
  }
});

console.log('Total untagged candidates:', untagged.length);
untagged.forEach(item => {
  console.log(`L${item.lineNum}: "${item.text}" -> ${item.line}`);
});
