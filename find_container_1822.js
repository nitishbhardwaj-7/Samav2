fetch('https://samaproductionme.com/wp-json/wp/v2/pages/1822')
  .then(r=>r.json())
  .then(d=> {
    const html = d.content.rendered;
    const idx = html.indexOf('SAMA Production is a multidisciplinary');
    if (idx !== -1) {
      const chunk = html.substring(idx, idx + 5000);
      const matches = chunk.match(/data-id="([^"]+)"[^>]*data-settings="[^"]*background_background[^"]*"/g);
      console.log(matches);
    }
  });
