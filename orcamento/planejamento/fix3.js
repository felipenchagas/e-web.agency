const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// Replace client-logo with logo.png
content = content.replace(
  /<img class="client-logo" src="[^"]+" alt="Logo Pantelas">/,
  '<img class="client-logo" src="logo.png" alt="Logo Pantelas">'
);

fs.writeFileSync(path, content);
console.log('Done!');
