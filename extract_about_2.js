const fs = require('fs');
const html = require('./homepage_data.json').content.rendered;
const idx = html.indexOf('SAMA Production is a multidisciplinary');
fs.writeFileSync('about_section_2.html', html.substring(idx, idx + 4000));
