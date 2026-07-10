async function find(id) {
  try {
    const r = await fetch('https://samaproductionme.com/wp-content/uploads/elementor/css/post-' + id + '.css');
    if (!r.ok) {
      console.log(`Failed to fetch post-${id}.css (status: ${r.status})`);
      return;
    }
    const css = await r.text();
    const re = /\.elementor-element-([a-f0-9]+)[^{]*\{[^}]*background-image:\s*url\(([^)]+)\)/gi;
    let match;
    console.log('=== CSS POST ' + id + ' ===');
    while ((match = re.exec(css)) !== null) {
      const elId = match[1];
      const imgUrl = match[2].replace(/['"]/g, '').trim();
      console.log(`${elId} -> ${imgUrl}`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await find(7);
  await find(1822);
  await find(472);
  await find(874);
  await find(1006);
  await find(1113);
}

run();
