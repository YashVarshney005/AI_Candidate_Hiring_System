import * as lucide from 'lucide-react';
import fs from 'fs';
const gitIcons = Object.keys(lucide).filter(k => k.toLowerCase().includes('git'));
const linkIcons = Object.keys(lucide).filter(k => k.toLowerCase().includes('link'));
fs.writeFileSync('output-utf8.txt', JSON.stringify({gitIcons, linkIcons}, null, 2), 'utf8');
