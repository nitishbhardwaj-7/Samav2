const test = async (id) => {
  const r = await fetch('https://samaproductionme.com/wp-json/wp/v2/pages/' + id);
  const page = await r.json();
  const html = page.content.rendered;
  const ctaTitleMatch = html.match(/<h[1-6][^>]*>([^<]*closer look[^<]*)<\/h[1-6]>/i);
  const ctaLinkMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>(?:(?!<\/a>)[\s\S])*?<span class="elementor-button-text">([^<]*)<\/span>(?:(?!<\/a>)[\s\S])*?<\/a>/i);
  console.log(id, 'ctaTitle:', ctaTitleMatch ? ctaTitleMatch[1].trim() : null);
  console.log(id, 'link:', ctaLinkMatch ? ctaLinkMatch[1].trim() : null, 'text:', ctaLinkMatch ? ctaLinkMatch[2].trim() : null);
};

test(874);
test(472);
test(7);
