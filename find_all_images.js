const fs = require('fs');
const d = require('./homepage_data.json');
const html = d.content.rendered;
const regex = /https:\/\/samaproductionme\.com[^"'\s\)]+\.(png|jpg|jpeg|webp)/gi;
const matches = [...new Set(html.match(regex))];
for (const m of matches) {
  console.log(m);
}
