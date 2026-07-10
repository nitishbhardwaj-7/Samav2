fetch('https://samaproductionme.com/wp-content/uploads/elementor/css/post-7.css')
  .then(r=>r.text())
  .then(css => {
    const idx = css.indexOf('about_us_video.png');
    if (idx !== -1) {
      console.log(css.substring(Math.max(0, idx - 150), idx + 50));
    }
  });
