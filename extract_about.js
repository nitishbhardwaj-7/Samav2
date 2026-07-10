const fs = require('fs');
const html = require('./homepage_data.json').content.rendered;
// Find "about us"
const idx = html.indexOf('SAMA Production is a multidisciplinary');
if (idx !== -1) {
    const start = Math.max(0, html.lastIndexOf('<section', idx));
    const end = html.indexOf('</section>', idx) + 10;
    fs.writeFileSync('about_section.html', html.substring(start, end));
} else {
    console.log("Not found");
}
