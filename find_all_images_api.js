const fetch = require('node-fetch'); // wait, built in fetch in Node 18+
fetch('https://samaproductionme.com/wp-json/wp/v2/pages/7').then(r=>r.json()).then(d1 => {
  fetch('https://samaproductionme.com/wp-json/wp/v2/pages/1822').then(r=>r.json()).then(d2 => {
    const html1 = d1.content.rendered;
    const html2 = d2.content.rendered;
    const regex = /https:\/\/samaproductionme\.com\/wp-content\/uploads\/[a-zA-Z0-9_/\.-]+\.(png|jpg|jpeg)/g;
    console.log("Homepage Images:");
    console.log([...new Set(html1.match(regex))]);
    console.log("\nAbout Page Images:");
    console.log([...new Set(html2.match(regex))]);
  });
});
