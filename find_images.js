const fs = require('fs');
const d = require('./homepage_data.json');
const html = d.content.rendered;
const regex = /<img[^>]+src="([^"]+)"[^>]*>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(match[1]);
}
