const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let body = bodyMatch ? bodyMatch[1] : html;

body = body.replace(/<script>[\s\S]*?<\/script>/gi, '');

body = body.replace(/class="/g, 'className="');
body = body.replace(/for="/g, 'htmlFor="');

body = body.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />');

body = body.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styleObj = {};
    styleString.split(';').forEach(rule => {
        if (!rule.trim()) return;
        let [key, ...valParts] = rule.split(':');
        if (!key || valParts.length === 0) return;
        let value = valParts.join(':');
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[key] = value.trim();
    });
    return `style={${JSON.stringify(styleObj)}}`;
});

body = body.replace(/stroke-width=/g, 'strokeWidth=');
body = body.replace(/stroke-linecap=/g, 'strokeLinecap=');
body = body.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
body = body.replace(/fill-rule=/g, 'fillRule=');
body = body.replace(/clip-rule=/g, 'clipRule=');
body = body.replace(/viewbox=/gi, 'viewBox=');

body = body.replace(/onclick="([^"]*)"/gi, ''); 
body = body.replace(/onmouseover="([^"]*)"/gi, ''); 
body = body.replace(/onmouseout="([^"]*)"/gi, ''); 
body = body.replace(/<!--[\s\S]*?-->/g, '');

const jsx = `
import Link from 'next/link';

export default function Home() {
  return (
    <>
      ${body}
    </>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', jsx);

const css = fs.readFileSync('style.css', 'utf8');
const globalsPath = 'src/app/globals.css';
let globals = fs.existsSync(globalsPath) ? fs.readFileSync(globalsPath, 'utf8') : '';
fs.writeFileSync(globalsPath, globals + '\n' + css);
console.log('Conversion complete!');
