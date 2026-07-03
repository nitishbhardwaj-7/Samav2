const fs = require('fs');
const html = fs.readFileSync('scratch_interior.html', 'utf8');
const matches = html.match(/<a[^>]+href="([^"]+)"[^>]*>/g);
if (matches) {
    const projectLinks = matches.filter(m => m.includes('/projects/') || m.includes('/interior/'));
    console.log(projectLinks.join('\n'));
}
