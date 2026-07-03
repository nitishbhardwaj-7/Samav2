const fs = require('fs');
const html = fs.readFileSync('scratch_projects.html', 'utf8');
const matches = html.match(/<a[^>]+href="([^"]+)"[^>]*>/g);
if (matches) {
    const projectLinks = matches.filter(m => m.includes('/projects/') || m.includes('/interior/'));
    console.log("Projects Links on /projects/ page:");
    console.log(projectLinks.join('\n'));
} else {
    console.log("No matches found.");
}
