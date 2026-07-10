fetch('https://samaproductionme.com/wp-content/uploads/elementor/css/post-7.css')
  .then(r=>r.text())
  .then(css => {
    const match = css.match(/\.elementor-element-9b5a80d[^{]*\{[^}]*background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
    console.log(match ? match[1] : 'not found');
  });
