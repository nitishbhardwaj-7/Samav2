fetch('https://samaproductionme.com/wp-content/uploads/elementor/css/post-7.css')
  .then(r => r.text())
  .then(css => {
    const matches = css.matchAll(/url\(['"]?(https:\/\/samaproductionme\.com\/wp-content\/uploads\/[^'"]+)['"]?\)/gi);
    const urls = [...new Set([...matches].map(m => m[1]))];
    console.log(urls.join('\n'));
  });
