fetch('https://samaproductionme.com/wp-content/uploads/elementor/css/post-1822.css')
  .then(r=>r.text())
  .then(css => {
    const match = css.match(/\.elementor-element-206b31a[^{]*\{[^}]*background-image:\s*url\(['"]?([^'"]+)['"]?\)/i)
               || css.match(/\.elementor-element-206b31a[^}]*background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
    console.log(match ? match[1] : 'not found');
  });
