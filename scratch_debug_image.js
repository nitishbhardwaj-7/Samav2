const https = require('https');
const http = require('http');

function fetchText(url) {
  const lib = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
      res.on('error', reject);
    });
  });
}

async function main() {
  // Check the about-us page (1822) API
  console.log("=== Checking About Us page API (page 1822) ===");
  const api = await fetchText('https://samaproductionme.com/wp-json/wp/v2/pages/1822');
  const page = JSON.parse(api);
  const html = page.content?.rendered || "";
  
  // Search for Frame-139
  if (html.includes('Frame-139')) {
    console.log("FOUND Frame-139 in about-us API HTML!");
    const idx = html.indexOf('Frame-139');
    console.log("Context:", html.substring(Math.max(0, idx - 200), idx + 200));
  } else {
    console.log("Frame-139 NOT found in about-us API HTML");
  }
  
  // Search for about_us_video
  if (html.includes('about_us_video')) {
    console.log("\nabout_us_video IS in about-us API HTML (old image still referenced)");
  } else {
    console.log("\nabout_us_video NOT in about-us API HTML");
  }
  
  // Check rendered about-us page
  console.log("\n=== Checking rendered about-us page ===");
  const rendered = await fetchText('https://samaproductionme.com/about-us/');
  
  if (rendered.includes('Frame-139')) {
    console.log("FOUND Frame-139 in rendered about-us page!");
    // Find all occurrences
    const matches = rendered.match(/Frame-139[^'")\s]*/g);
    if (matches) {
      console.log("Occurrences:", [...new Set(matches)]);
    }
  } else {
    console.log("Frame-139 NOT in rendered about-us page");
  }
  
  // Check the about-us CSS files
  console.log("\n=== Checking about-us CSS for image ===");
  const linkMatches = rendered.match(/<link[^>]+href=['"]([^'"]+\.css[^'"]*)['"]/gi);
  const cssUrls = [];
  if (linkMatches) {
    for (const m of linkMatches) {
      const hrefMatch = m.match(/href=['"]([^'"]+)['"]/);
      if (hrefMatch) cssUrls.push(hrefMatch[1]);
    }
  }
  
  for (const url of cssUrls) {
    try {
      const css = await fetchText(url);
      if (css.includes('Frame-139')) {
        console.log("FOUND Frame-139 in CSS:", url);
        const idx = css.indexOf('Frame-139');
        console.log("Context:", css.substring(Math.max(0, idx - 200), idx + 100));
      }
    } catch (e) { /* skip */ }
  }
  
  // Also check the homepage rendered page and CSS for Frame-139
  console.log("\n=== Checking homepage for Frame-139 ===");
  const homepage = await fetchText('https://samaproductionme.com/');
  if (homepage.includes('Frame-139')) {
    console.log("FOUND Frame-139 in homepage HTML!");
  } else {
    console.log("Frame-139 NOT in homepage HTML");
  }
  
  const homeCssLinks = homepage.match(/<link[^>]+href=['"]([^'"]+\.css[^'"]*)['"]/gi);
  const homeCssUrls = [];
  if (homeCssLinks) {
    for (const m of homeCssLinks) {
      const hrefMatch = m.match(/href=['"]([^'"]+)['"]/);
      if (hrefMatch) homeCssUrls.push(hrefMatch[1]);
    }
  }
  
  for (const url of homeCssUrls) {
    try {
      const css = await fetchText(url);
      if (css.includes('Frame-139')) {
        console.log("FOUND Frame-139 in homepage CSS:", url);
      }
    } catch (e) { /* skip */ }
  }
}

main().catch(console.error);
