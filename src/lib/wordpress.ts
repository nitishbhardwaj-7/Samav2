export interface ProjectItem {
  number: string;
  title: string;
  image: string;
  link: string;
  btnText?: string;
}

export interface ClientLogo {
  src: string;
  alt: string;
}

export interface HomepageData {
  hero: {
    title: string;
    middleText: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
  about: {
    sectionName: string;
    title: string;
    description: string;
    image: string;
    knowMoreText?: string;
    knowMoreUrl?: string;
  };
  projects: {
    title: string;
    subtitle: string;
    description: string;
    items: ProjectItem[];
  };
  clients: {
    title: string;
    description: string;
    logos: ClientLogo[];
  };
  reachOut: {
    title: string;
    image: string;
    phone: string;
    phoneRaw: string;
  };
}

const FALLBACK_DATA: HomepageData = {
  hero: {
    title: "SPACES",
    middleText: "THAT SPEAK FOR THE",
    subtitle: "BRAND",
    description: "Elegant spaces crafted with purpose, detail, and a sense of permanence.",
    backgroundImage: "https://samaproductionme.com/wp-content/uploads/2026/02/main-banners.png",
  },
  about: {
    sectionName: "about us",
    title: "SAMA",
    description: "SAMA Production is a multidisciplinary design and build studio known for crafting refined, high-impact environments across interiors, exhibitions, and brand activations. Defined by precision, material sophistication, and architectural clarity, each project is meticulously executed to embody brand identity at the highest level.",
    image: "https://samaproductionme.com/wp-content/uploads/2026/06/Frame-139.png",
    knowMoreText: "Know More",
    knowMoreUrl: "/about-us",
  },
  projects: {
    title: "Projects",
    subtitle: "Spaces Brought to Life",
    description: "A curated selection of interiors that reflect our design philosophy, attention to detail, and regional expertise.",
    items: [
      { number: "01", title: "Interior", image: "https://samaproductionme.com/wp-content/uploads/2026/06/interior-1-1.png", link: "/interior", btnText: "Know More" },
      { number: "02", title: "Exhibition Design & Build", image: "https://samaproductionme.com/wp-content/uploads/2026/06/Exhibition-1-1.png", link: "/exhibition", btnText: "Know More" },
      { number: "03", title: "Events", image: "https://samaproductionme.com/wp-content/uploads/2026/06/events-1-1.png", link: "#", btnText: "Know More" },
      { number: "04", title: "Mall Activation & Travel Retail", image: "https://samaproductionme.com/wp-content/uploads/2026/06/Mall-Activation-1-1-2.png", link: "#", btnText: "Know More" },
    ],
  },
  clients: {
    title: "Our Clients",
    description: "Our clients include leading global brands who trust us to deliver refined, high-quality environments that elevate their presence and reflect their identity with excellence.",
    logos: [
      { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-21-Vectorized-2.png", alt: "Eucerin Logo" },
      { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-22-Vectorized-2.png", alt: "AMMT Logo" },
      { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-23-Vectorized-2.png", alt: "Audi Logo" },
      { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-24-Vectorized-1.png", alt: "Casio Logo" },
      { src: "https://samaproductionme.com/wp-content/uploads/2026/05/Vector.png", alt: "DHL Logo" },
    ],
  },
  reachOut: {
    title: "Reach Out",
    image: "https://samaproductionme.com/wp-content/uploads/2026/05/vertical-shot-dining-set-featuring-modern-chairs-a-2026-01-22-02-31-15-utc_1-1.png",
    phone: "+971 4 320 0416",
    phoneRaw: "+97143200416",
  },
};

const REVALIDATE_VAL = process.env.NODE_ENV === "development" ? 0 : 60;

/**
 * Returns the full live WordPress URL for an image.
 * We do NOT convert to local paths — images are served directly from WordPress.
 */
export function mapWpUrl(url: string): string {
  if (!url) return "";
  // Ensure the URL is absolute
  if (url.startsWith("http")) return url;
  // If it's a relative wp-content path, prepend the site base
  if (url.startsWith("/wp-content")) return `https://samaproductionme.com${url}`;
  return url;
}

/**
 * Extracts a background image from WordPress Elementor CSS.
 * Elementor stores certain images as CSS background-image on containers,
 * not as inline <img> tags, so they're not in the REST API HTML.
 * We fetch the live rendered page, find the CSS file, and extract the URL.
 *
 * @param pageUrl - The WordPress page URL to fetch CSS links from
 * @param elementIds - Elementor element IDs to search for (e.g. "c4b6a00")
 */
async function fetchElementorBgImage(pageUrl: string, elementIds: string[], postId?: number): Promise<string | null> {
  try {
    // 1. Try direct Elementor CSS fetch first if postId is provided
    if (postId) {
      const directCssUrl = `https://samaproductionme.com/wp-content/uploads/elementor/css/post-${postId}.css`;
      try {
        const cssRes = await fetch(directCssUrl, {
          next: { revalidate: REVALIDATE_VAL },
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (cssRes.ok) {
          const css = await cssRes.text();
          for (const elId of elementIds) {
            if (css.includes(elId)) {
              const re = new RegExp("elementor-element-" + elId + "[^}]*background-image:\\s*url\\(([^)]+)\\)", "i");
              const bgMatch = css.match(re);
              if (bgMatch) {
                const imgUrl = bgMatch[1].replace(/['"]/g, "").trim();
                console.log(`Successfully fetched Elementor background image from direct CSS for post ${postId}:`, imgUrl);
                return imgUrl;
              }
            }
          }
        }
      } catch (err) {
        console.warn(`Direct CSS fetch failed for post ${postId}, falling back to page scraping:`, err);
      }
    }

    // 2. Fallback to HTML page scraping with next: { revalidate: REVALIDATE_VAL }
    const pageRes = await fetch(pageUrl, {
      next: { revalidate: REVALIDATE_VAL },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!pageRes.ok) return null;
    const pageHTML = await pageRes.text();

    // Find all CSS file URLs from <link> tags
    const linkMatches = pageHTML.match(/<link[^>]+href=['"]([^'"]+\.css[^'"]*)['"'][^>]*>/gi);
    if (!linkMatches) return null;

    const cssUrls: string[] = [];
    for (const m of linkMatches) {
      const hrefMatch = m.match(/href=['"]([^'"]+)['"]/);
      if (hrefMatch) cssUrls.push(hrefMatch[1]);
    }

    // Search CSS files for matching element background-image with next: { revalidate: REVALIDATE_VAL }
    for (const cssUrl of cssUrls) {
      try {
        const cssRes = await fetch(cssUrl, {
          next: { revalidate: REVALIDATE_VAL },
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!cssRes.ok) continue;
        const css = await cssRes.text();

        for (const elId of elementIds) {
          if (css.includes(elId)) {
            const re = new RegExp("elementor-element-" + elId + "[^}]*background-image:\\s*url\\(([^)]+)\\)", "i");
            const bgMatch = css.match(re);
            if (bgMatch) {
              const imgUrl = bgMatch[1].replace(/['"]/g, "").trim();
              console.log(`Successfully fetched Elementor background image from scraped CSS ${cssUrl}:`, imgUrl);
              return imgUrl;
            }
          }
        }
      } catch {
        // Skip CSS files that fail to load
      }
    }

    return null;
  } catch (err) {
    console.warn("Failed to fetch Elementor background image from CSS:", err);
    return null;
  }
}


export function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&ndash;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&mdash;/g, "—")
    .replace(/&#8220;/g, "“")
    .replace(/&ldquo;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&rdquo;/g, "”")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"');
}

export async function getHomepageData(): Promise<HomepageData> {
  const url = "https://samaproductionme.com/wp-json/wp/v2/pages/7";
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_VAL }, // Cache for 1 hour in production, 0 in development
    });

    if (!res.ok) {
      console.warn(`Failed to fetch WordPress page data: ${res.statusText}. Using fallback data.`);
      return FALLBACK_DATA;
    }

    const page = await res.json();
    const html = page.content?.rendered || "";

    if (!html) {
      console.warn("WordPress response contains empty content. Using fallback data.");
      return FALLBACK_DATA;
    }

    const data: HomepageData = JSON.parse(JSON.stringify(FALLBACK_DATA));

    // Parse Hero Title parts (from Elementor containers a839d75, 869ec3a, 061c3d6)
    const heroTitleMatch = html.match(/class="[^"]*elementor-element-a839d75[^"]*"[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const heroMiddleMatch = html.match(/class="[^"]*elementor-element-869ec3a[^"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    const heroSubtitleMatch = html.match(/class="[^"]*elementor-element-061c3d6[^"]*"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i);

    if (heroTitleMatch) data.hero.title = decodeHtmlEntities(heroTitleMatch[1].replace(/<[^>]+>/g, "").trim());
    if (heroMiddleMatch) data.hero.middleText = decodeHtmlEntities(heroMiddleMatch[1].replace(/<[^>]+>/g, "").trim());
    if (heroSubtitleMatch) data.hero.subtitle = decodeHtmlEntities(heroSubtitleMatch[1].replace(/<[^>]+>/g, "").trim());

    // Parse About Section Name (from Elementor container f9d9fc6)
    const aboutSectionNameMatch = html.match(/class="[^"]*elementor-element-f9d9fc6[^"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    if (aboutSectionNameMatch) {
      data.about.sectionName = decodeHtmlEntities(aboutSectionNameMatch[1].replace(/<[^>]+>/g, "").trim());
    }

    // Parse Projects Section Headers (from Elementor containers f3b5645, a2ebccf, 0764706)
    const projectsTitleMatch = html.match(/class="[^"]*elementor-element-f3b5645[^"]*"[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const projectsSubtitleMatch = html.match(/class="[^"]*elementor-element-a2ebccf[^"]*"[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const projectsDescMatch = html.match(/class="[^"]*elementor-element-0764706[^"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);

    if (projectsTitleMatch) data.projects.title = decodeHtmlEntities(projectsTitleMatch[1].replace(/<[^>]+>/g, "").trim());
    if (projectsSubtitleMatch) data.projects.subtitle = decodeHtmlEntities(projectsSubtitleMatch[1].replace(/<[^>]+>/g, "").trim());
    if (projectsDescMatch) data.projects.description = decodeHtmlEntities(projectsDescMatch[1].replace(/<[^>]+>/g, "").trim());

    // Parse Clients Section Headers (from Elementor containers d806e58, aebbb9d)
    const clientsTitleMatch = html.match(/class="[^"]*elementor-element-d806e58[^"]*"[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const clientsDescMatch = html.match(/class="[^"]*elementor-element-aebbb9d[^"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);

    if (clientsTitleMatch) data.clients.title = decodeHtmlEntities(clientsTitleMatch[1].replace(/<[^>]+>/g, "").trim());
    if (clientsDescMatch) data.clients.description = decodeHtmlEntities(clientsDescMatch[1].replace(/<[^>]+>/g, "").trim());

    // 1. Parse Hero Description & Quote (if found in content)
    const heroDescMatch = html.match(/class="[^"]*elementor-icon-box-description[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
    if (heroDescMatch) {
      data.hero.description = heroDescMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 2. Parse About Section Description
    const aboutDescMatch = html.match(/class="[^"]*elementor-widget-text-editor[^"]*"[^>]*>[\s\S]*?<p>([\s\S]*?)<\/p>/i);
    if (aboutDescMatch) {
      data.about.description = aboutDescMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 1b. Parse Hero Background Image (from Elementor CSS background)
    // Homepage uses element 89447ba for the Hero background image
    const heroBgImage = await fetchElementorBgImage("https://samaproductionme.com/", ["89447ba"], 7);
    if (heroBgImage) {
      data.hero.backgroundImage = heroBgImage;
    }

    // 2b. Parse About Section Image (from Elementor CSS background)
    // Homepage uses element c4b6a00 for the About section background image
    const aboutImage = await fetchElementorBgImage("https://samaproductionme.com/", ["c4b6a00"], 7);
    if (aboutImage) {
      data.about.image = aboutImage;
    }

    // Parse About Section button (from Elementor container d47da7e)
    const aboutBtnMatch = html.match(/class="[^"]*elementor-element-d47da7e[^"]*"[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>(?:(?!<\/a>)[\s\S])*?<span class="elementor-button-text">([^<]*)<\/span>(?:(?!<\/a>)[\s\S])*?<\/a>/i);
    if (aboutBtnMatch) {
      data.about.knowMoreUrl = mapWpUrl(aboutBtnMatch[1].trim());
      data.about.knowMoreText = decodeHtmlEntities(aboutBtnMatch[2].trim());
    }

    // 3. Parse Projects
    const projectCards = html.split('<div class="proj-card');
    if (projectCards.length > 1) {
      const parsedItems: ProjectItem[] = [];
      for (let i = 1; i < projectCards.length; i++) {
        const cardHtml = projectCards[i];

        const numMatch = cardHtml.match(/class="proj-number-box">([^<]+)/);
        const titleMatch = cardHtml.match(/<h3><a[^>]*>([\s\S]*?)<\/a>/);
        const imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/);
        const linkMatch = cardHtml.match(/class="proj-btn"><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);

        if (imgMatch) {
          let finalLink = "#";
          let btnText = "Know More";
          if (linkMatch) {
            const rawLink = linkMatch[1].trim();
            btnText = decodeHtmlEntities(linkMatch[2].replace(/<[^>]+>/g, "").trim()) || "Know More";
            if (rawLink.startsWith("http")) {
              try {
                finalLink = new URL(rawLink).pathname;
              } catch (e) {
                finalLink = rawLink;
              }
            } else {
              finalLink = rawLink;
            }
          }

          const parsedTitle = titleMatch
            ? decodeHtmlEntities(titleMatch[1].replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").trim())
            : "Project";

          // Override link for known major categories
          if (parsedTitle.toLowerCase().includes("interior")) {
            finalLink = "/interior";
          } else if (parsedTitle.toLowerCase().includes("exhibition")) {
            finalLink = "/exhibition";
          } else if (parsedTitle.toLowerCase().includes("events")) {
            finalLink = "/events";
          } else if (parsedTitle.toLowerCase().includes("mall activation") || parsedTitle.toLowerCase().includes("travel retail")) {
            finalLink = "/mall-activation-travel-retail";
          }

          parsedItems.push({
            number: numMatch ? numMatch[1].trim() : `0${i}`,
            title: parsedTitle,
            image: mapWpUrl(imgMatch[1].trim()),
            link: finalLink,
            btnText: btnText,
          });
        }
      }

      if (parsedItems.length > 0) {
        data.projects.items = parsedItems;
      }
    }

    // 4. Parse Client Logos (from Swiper slides)
    const swiperSlides = html.split('<div class="swiper-slide"');
    if (swiperSlides.length > 1) {
      const parsedLogos: ClientLogo[] = [];
      for (let i = 1; i < swiperSlides.length; i++) {
        const slideHtml = swiperSlides[i];
        const imgMatch = slideHtml.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) {
          const src = mapWpUrl(imgMatch[1].trim());
          const altMatch = slideHtml.match(/alt="([^"]*)"/);

          if (!parsedLogos.some((l) => l.src === src)) {
            parsedLogos.push({
              src,
              alt: altMatch && altMatch[1] ? altMatch[1].trim() : "Client Logo",
            });
          }
        }
      }

      if (parsedLogos.length > 0) {
        data.clients.logos = parsedLogos;
      }
    }

    // 5. Parse Reach Out
    if (html.includes('id="contactus"')) {
      const reachOutPart = html.split('id="contactus"')[1] || "";
      const imgMatch = reachOutPart.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) {
        data.reachOut.image = mapWpUrl(imgMatch[1].trim());
      }

      const phoneMatch = reachOutPart.match(/href="tel:([^"]+)"/);
      if (phoneMatch) {
        data.reachOut.phoneRaw = decodeURIComponent(phoneMatch[1].trim());
      }

      const phoneTextMatch = reachOutPart.match(/class="elementor-icon-list-text">([^<]+)/);
      if (phoneTextMatch) {
        data.reachOut.phone = phoneTextMatch[1].trim();
      }

      // Parse Reach Out Title (from Elementor container 12fc823)
      const reachOutTitleMatch = reachOutPart.match(/class="[^"]*elementor-element-12fc823[^"]*"[\s\S]*?<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
      if (reachOutTitleMatch) {
        data.reachOut.title = decodeHtmlEntities(reachOutTitleMatch[1].replace(/<[^>]+>/g, "").trim());
      }
    }

    return data;
  } catch (err) {
    console.error("Error in getHomepageData:", err);
    return FALLBACK_DATA;
  }
}

export interface AboutPageData {
  hero: {
    title: string;
    middleText: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
  about: {
    sectionName: string;
    title: string;
    description: string;
    image: string;
  };
  designSection: {
    image: string;
    quote: string;
  };
  whoWeAre: {
    title: string;
    pillars: {
      title: string;
      description: string;
    }[];
  };
  certificationsSection: {
    title: string;
    items: {
      image: string;
      title: string;
    }[];
  };
}

const FALLBACK_ABOUT_DATA: AboutPageData = {
  hero: {
    title: "VISION",
    middleText: "THAT DRIVES THE",
    subtitle: "CRAFT",
    description: "Elegant spaces crafted with purpose, detail, and a sense of permanence.",
    backgroundImage: "https://samaproductionme.com/wp-content/uploads/2026/06/dining-room-in-a-coffee-shop-on-two-tone-wall-back-2026-03-24-01-02-36-utc-scaled.jpg",
  },
  about: {
    sectionName: "about us",
    title: "SAMA",
    description: "SAMA Production is a multidisciplinary design and build studio known for crafting refined, high-impact environments across interiors, exhibitions, and brand activations. Defined by precision, material sophistication, and architectural clarity, each project is meticulously executed to embody brand identity at the highest level.",
    image: "https://samaproductionme.com/wp-content/uploads/2026/06/Frame-139.png",
  },
  designSection: {
    image: "https://samaproductionme.com/wp-content/uploads/2026/06/Mask-group2.png",
    quote: "“We design and build spaces where clarity, detail, and purpose come together to create meaningful brand experiences.”",
  },
  whoWeAre: {
    title: "Who We Are",
    pillars: [
      {
        title: "Design Led Thinking",
        description: "We approach every project with a strong design foundation, focusing on spatial planning, material selection, and visual clarity to create environments that are both functional and impactful.",
      },
      {
        title: "End to End Execution",
        description: "From concept development to final installation, we manage every stage of the process in-house, ensuring consistency, quality, and precision across all deliverables.",
      },
      {
        title: "Detail & Craftsmanship",
        description: "Every element is carefully considered and executed with attention to detail, resulting in refined spaces that reflect quality, durability, and strong brand presence.",
      },
    ],
  },
  certificationsSection: {
    title: "Certifications",
    items: [
      {
        image: "https://samaproductionme.com/wp-content/uploads/2026/05/blue-certificates.png",
        title: "2015 Quality Management System Certification"
      },
      {
        image: "https://samaproductionme.com/wp-content/uploads/2026/05/2-230132.png",
        title: "2018 Occupational Health & Safety Certification"
      },
      {
        image: "https://samaproductionme.com/wp-content/uploads/2026/05/3-61.png",
        title: "2015 Environmental Management Certification"
      }
    ]
  }
};

export async function getAboutPageData(): Promise<AboutPageData> {
  const url = "https://samaproductionme.com/wp-json/wp/v2/pages/1822";
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_VAL }, // Cache for 1 hour in production, 0 in development
    });

    if (!res.ok) {
      console.warn(`Failed to fetch About Us WordPress page data: ${res.statusText}. Using fallback data.`);
      return FALLBACK_ABOUT_DATA;
    }

    const page = await res.json();
    const html = page.content?.rendered || "";

    if (!html) {
      console.warn("WordPress response for About Us contains empty content. Using fallback data.");
      return FALLBACK_ABOUT_DATA;
    }

    const data: AboutPageData = JSON.parse(JSON.stringify(FALLBACK_ABOUT_DATA));

    // 1. Extract Hero Title parts (from Elementor container ee18c44, 313664f, 1cf2ad1)
    const titleMatch = html.match(/class="[^"]*elementor-element-ee18c44[^"]*"[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const middleMatch = html.match(/class="[^"]*elementor-element-313664f[^"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    const subtitleMatch = html.match(/class="[^"]*elementor-element-1cf2ad1[^"]*"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i);

    if (titleMatch) data.hero.title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
    if (middleMatch) data.hero.middleText = middleMatch[1].replace(/<[^>]+>/g, "").trim();
    if (subtitleMatch) data.hero.subtitle = subtitleMatch[1].replace(/<[^>]+>/g, "").trim();

    // 2. Extract Hero Description/Quote (from Elementor container dae6a9c)
    const heroDescMatch = html.match(/class="[^"]*elementor-element-dae6a9c[^"]*"[\s\S]*?<p class="elementor-icon-box-description">([\s\S]*?)<\/p>/i);
    if (heroDescMatch) {
      data.hero.description = heroDescMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 3. Extract About Section Description (from Elementor container 8ba34d7)
    const aboutDescMatch = html.match(/class="[^"]*elementor-element-8ba34d7[^"]*"[\s\S]*?<p>([\s\S]*?)<\/p>/i);
    if (aboutDescMatch) {
      data.about.description = aboutDescMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 1b. Extract Hero Background Image (from Elementor CSS background)
    // About-us page uses element eb24edb for the Hero background image
    const heroBgImage = await fetchElementorBgImage("https://samaproductionme.com/about-us/", ["eb24edb"], 1822);
    if (heroBgImage) {
      data.hero.backgroundImage = heroBgImage;
    }

    // 3b. Extract About Section Image (from Elementor CSS background)
    // About-us page uses element a08f130 for the About section background image
    const aboutImage = await fetchElementorBgImage("https://samaproductionme.com/about-us/", ["a08f130"], 1822);
    if (aboutImage) {
      data.about.image = aboutImage;
    }

    // Extract About Section Name (from Elementor container 80dc148)
    const aboutSectionNameMatch = html.match(/class="[^"]*elementor-element-80dc148[^"]*"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    if (aboutSectionNameMatch) {
      data.about.sectionName = decodeHtmlEntities(aboutSectionNameMatch[1].replace(/<[^>]+>/g, "").trim());
    }

    // Extract Who We Are Title (from Elementor container 87d842d)
    const whoWeAreTitleMatch = html.match(/class="[^"]*elementor-element-87d842d[^"]*"[\s\S]*?<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
    if (whoWeAreTitleMatch) {
      data.whoWeAre.title = decodeHtmlEntities(whoWeAreTitleMatch[1].replace(/<[^>]+>/g, "").trim());
    }

    // Extract Certifications Section Title (from Elementor container 264a05c)
    const certsTitleMatch = html.match(/class="[^"]*elementor-element-264a05c[^"]*"[\s\S]*?<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
    if (certsTitleMatch) {
      data.certificationsSection.title = decodeHtmlEntities(certsTitleMatch[1].replace(/<[^>]+>/g, "").trim());
    }

    // 4. Extract Design Section Quote (from Elementor container 5abb09a)
    const designQuoteMatch = html.match(/class="[^"]*elementor-element-5abb09a[^"]*"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (designQuoteMatch) {
      data.designSection.quote = designQuoteMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 5. Extract Design Section Image (from Elementor container 7fc50ff)
    const designImgMatch = html.match(/class="[^"]*elementor-element-7fc50ff[^"]*"[\s\S]*?<img[^>]+src="([^"]+)"/i);
    if (designImgMatch) {
      data.designSection.image = designImgMatch[1].trim();
    } else {
      // Fallback: Try fetching as Elementor background image if not an inline img tag
      const designBgImage = await fetchElementorBgImage("https://samaproductionme.com/about-us/", ["7fc50ff"], 1822);
      if (designBgImage) {
        data.designSection.image = designBgImage;
      }
    }

    // 6. Extract Who We Are Pillars (from Elementor containers 5362fc1, f6f0b1a, 39d30e4)
    const pillarHashes = ["5362fc1", "f6f0b1a", "39d30e4"];
    const pillars = pillarHashes.map(hash => {
      const regex = new RegExp(`class="[^"]*elementor-element-${hash}[^"]*"[\\s\\S]*?<h3[^>]*>([\\s\\S]*?)<\\/h3>[\\s\\S]*?<p>([\\s\\S]*?)<\\/p>`, "i");
      const match = html.match(regex);
      if (match) {
        return {
          title: match[1].replace(/<[^>]+>/g, "").trim().replace(/&amp;/g, "&"),
          description: match[2].replace(/<[^>]+>/g, "").trim()
        };
      }
      return null;
    }).filter(Boolean);

    if (pillars && pillars.length > 0) {
      data.whoWeAre.pillars = pillars as any;
    }

    // 7. Extract Certifications (from Elementor containers d3f1b55, fe59af5, 6eff2f5)
    const certHashes = ["d3f1b55", "fe59af5", "6eff2f5"];
    const certItems = certHashes.map(hash => {
      const regex = new RegExp(`class="[^"]*elementor-element-${hash}[^"]*"[\\s\\S]*?<img[^>]+src="([^"]+)"[\\s\\S]*?<p[^>]*>([\\s\\S]*?)<\\/p>`, "i");
      const match = html.match(regex);
      if (match) {
        return {
          image: match[1].trim(),
          title: match[2].replace(/<[^>]+>/g, "").trim().replace(/&amp;/g, "&")
        };
      }
      return null;
    }).filter(Boolean);

    if (certItems && certItems.length > 0) {
      data.certificationsSection.items = certItems as any;
    }

    return data;
  } catch (err) {
    console.error("Error in getAboutPageData:", err);
    return FALLBACK_ABOUT_DATA;
  }
}

export interface InteriorProject {
  id: number;
  slug: string;
  title: string;
  content: string;
  featuredImage: string;
  gallery: string[];
  client?: string;
  size?: string;
  location?: string;
  downloadUrl?: string;
  customCategory?: string;
  isEvent?: boolean;
  projectCategory?: number[];
  yoast_head_json?: any;
}

export interface InteriorPageData {
  title: string;
  description: string;
  backgroundImage: string;
  ctaTitle?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
}

export type CategoryPageData = InteriorPageData;

export async function getGenericCategoryPageData(
  id: number | string,
  fallbackTitle: string,
  fallbackDesc: string,
  fallbackBg: string
): Promise<CategoryPageData> {
  const url = `https://samaproductionme.com/wp-json/wp/v2/pages/${id}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) {
      return {
        title: fallbackTitle,
        description: fallbackDesc,
        backgroundImage: fallbackBg,
        ctaTitle: "Take a closer look at our projects and capabilities.",
        ctaButtonText: "Download Portfolio",
        ctaButtonUrl: "/upload/SAMA-Production-Portfolio.pdf",
      };
    }
    const page = await res.json();
    const html = page.content?.rendered || "";

    // 1. Title
    const title = decodeHtmlEntities(page.title?.rendered || fallbackTitle);

    // 2. Description
    let description = fallbackDesc;
    const revealPart = html.split('id="sama-reveal-content"')[1] || html;
    const pMatch = revealPart.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      description = pMatch[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    }

    // 3. Background Image
    let backgroundImage = fallbackBg;
    if (page.featured_media) {
      const mediaRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media/${page.featured_media}`);
      if (mediaRes.ok) {
        const media = await mediaRes.json();
        backgroundImage = mapWpUrl(media.source_url);
      }
    } else {
      const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch) {
        backgroundImage = mapWpUrl(imgMatch[1]);
      }
    }

    // 4. CTA Title
    const ctaTitleMatch = html.match(/<h[1-6][^>]*>([^<]*closer look[^<]*)<\/h[1-6]>/i) ||
                          html.match(/<h[1-6][^>]*>([^<]*projects and capabilities[^<]*)<\/h[1-6]>/i);
    const ctaTitle = ctaTitleMatch 
      ? decodeHtmlEntities(ctaTitleMatch[1].replace(/<[^>]+>/g, "").trim())
      : "Take a closer look at our projects and capabilities.";

    // 5. CTA Button
    const ctaLinkMatch = html.match(/<a[^>]+href="([^"]+)"[^>]*>(?:(?!<\/a>)[\s\S])*?<span class="elementor-button-text">([^<]*)<\/span>(?:(?!<\/a>)[\s\S])*?<\/a>/i);
    const ctaButtonUrl = ctaLinkMatch ? mapWpUrl(ctaLinkMatch[1].trim()) : "/upload/SAMA-Production-Portfolio.pdf";
    const ctaButtonText = ctaLinkMatch ? decodeHtmlEntities(ctaLinkMatch[2].trim()) : "Download Portfolio";

    return {
      title,
      description,
      backgroundImage,
      ctaTitle,
      ctaButtonText,
      ctaButtonUrl,
    };
  } catch (err) {
    console.error(`Error fetching category page ${id} data:`, err);
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      backgroundImage: fallbackBg,
      ctaTitle: "Take a closer look at our projects and capabilities.",
      ctaButtonText: "Download Portfolio",
      ctaButtonUrl: "/upload/SAMA-Production-Portfolio.pdf",
    };
  }
}

export async function getInteriorPageData(): Promise<CategoryPageData> {
  return getGenericCategoryPageData(
    472,
    "Interior",
    "Our clients include leading global brands who trust us to deliver refined, high-quality environments.",
    "https://samaproductionme.com/wp-content/uploads/2026/06/interior-1-1.png"
  );
}

export async function getExhibitionPageData(): Promise<CategoryPageData> {
  return getGenericCategoryPageData(
    874,
    "Exhibition Design & Build",
    "Our clients include leading global brands who trust us to deliver refined, high-quality environments.",
    "https://samaproductionme.com/wp-content/uploads/2026/06/Frame-146-3-1.png"
  );
}

export async function getEventsPageData(): Promise<CategoryPageData> {
  return getGenericCategoryPageData(
    1006,
    "Events",
    "Our clients include leading global brands who trust us to deliver refined, high-quality environments.",
    "https://samaproductionme.com/wp-content/uploads/2026/06/Frame-146-3-1.png"
  );
}

export async function getMallActivationPageData(): Promise<CategoryPageData> {
  return getGenericCategoryPageData(
    1113,
    "Mall Activation & Travel Retail",
    "Our clients include leading global brands who trust us to deliver refined, high-quality environments.",
    "https://samaproductionme.com/wp-content/uploads/2026/06/Frame-146-3-1.png"
  );
}

export async function getInteriorProjects(): Promise<InteriorProject[]> {
  try {
    const res = await fetch("https://samaproductionme.com/wp-json/wp/v2/project?project_category=7&per_page=100", {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return [];
    const rawProjects = await res.json();

    const projects: InteriorProject[] = [];
    for (const p of rawProjects) {
      // Get featured image
      let featuredImage = "";
      if (p.featured_media) {
        const featRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media/${p.featured_media}`);
        if (featRes.ok) {
          const featMedia = await featRes.json();
          featuredImage = mapWpUrl(featMedia.source_url);
        }
      }

      // Get gallery (attached media items)
      const mediaRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media?parent=${p.id}&per_page=100`, {
        next: { revalidate: REVALIDATE_VAL },
      });
      let gallery: string[] = [];
      if (mediaRes.ok) {
        const mediaItems = await mediaRes.json();
        gallery = mediaItems.map((m: any) => mapWpUrl(m.source_url));
      }

      // If gallery is empty, put featured image inside it
      if (gallery.length === 0 && featuredImage) {
        gallery = [featuredImage];
      }

      projects.push({
        id: p.id,
        slug: p.slug,
        title: decodeHtmlEntities(p.title?.rendered || ""),
        content: p.content?.rendered || "",
        featuredImage,
        gallery,
        client: p.project_client || p.project_date || p.meta?.project_date || p.client || p.acf?.client || "",
        size: p.project_size || p.meta?.project_size || p.size || p.acf?.size || "",
        location: p.project_location || p.meta?.project_location || p.location || p.acf?.location || "",
        downloadUrl: p.project_download_url || p.meta?.project_download_url || p.downloadUrl || p.acf?.downloadUrl || "",
        customCategory: p.project_custom_category || p.meta?.project_custom_category || p.customCategory || p.acf?.customCategory || "",
        isEvent: p.project_category?.includes(13) || false,
        projectCategory: p.project_category || [],
      });
    }

    return projects;
  } catch (err) {
    console.error("Error in getInteriorProjects:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<InteriorProject | null> {
  try {
    const res = await fetch(`https://samaproductionme.com/wp-json/wp/v2/project?slug=${slug}`, {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return null;
    const projects = await res.json();
    if (projects.length === 0) return null;
    const p = projects[0];

    let featuredImage = "";
    if (p.featured_media) {
      const featRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media/${p.featured_media}`);
      if (featRes.ok) {
        const featMedia = await featRes.json();
        featuredImage = mapWpUrl(featMedia.source_url);
      }
    }

    const mediaRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media?parent=${p.id}&per_page=100`, {
      next: { revalidate: REVALIDATE_VAL },
    });
    let gallery: string[] = [];
    if (mediaRes.ok) {
      const mediaItems = await mediaRes.json();
      gallery = mediaItems.map((m: any) => mapWpUrl(m.source_url));
    }

    if (gallery.length === 0 && featuredImage) {
      gallery = [featuredImage];
    }

    return {
      id: p.id,
      slug: p.slug,
      title: decodeHtmlEntities(p.title?.rendered || ""),
      content: p.content?.rendered || "",
      featuredImage,
      gallery,
      client: p.project_client || p.project_date || p.meta?.project_date || p.client || p.acf?.client || "",
      size: p.project_size || p.meta?.project_size || p.size || p.acf?.size || "",
      location: p.project_location || p.meta?.project_location || p.location || p.acf?.location || "",
      downloadUrl: p.project_download_url || p.meta?.project_download_url || p.downloadUrl || p.acf?.downloadUrl || "",
      customCategory: p.project_custom_category || p.meta?.project_custom_category || p.customCategory || p.acf?.customCategory || "",
      isEvent: p.project_category?.includes(13) || false,
      projectCategory: p.project_category || [],
      yoast_head_json: p.yoast_head_json || null,
    };
  } catch (err) {
    console.error(`Error fetching project by slug ${slug}:`, err);
    return null;
  }
}

export async function getExhibitionProjects(): Promise<InteriorProject[]> {
  try {
    const res = await fetch("https://samaproductionme.com/wp-json/wp/v2/project?project_category=8&per_page=100", {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return [];
    const rawProjects = await res.json();

    const projects: InteriorProject[] = [];
    for (const p of rawProjects) {
      let featuredImage = "";
      if (p.featured_media) {
        const featRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media/${p.featured_media}`);
        if (featRes.ok) {
          const featMedia = await featRes.json();
          featuredImage = mapWpUrl(featMedia.source_url);
        }
      }

      const mediaRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media?parent=${p.id}&per_page=100`, {
        next: { revalidate: REVALIDATE_VAL },
      });
      let gallery: string[] = [];
      if (mediaRes.ok) {
        const mediaItems = await mediaRes.json();
        gallery = mediaItems.map((m: any) => mapWpUrl(m.source_url));
      }

      if (gallery.length === 0 && featuredImage) {
        gallery = [featuredImage];
      }

      projects.push({
        id: p.id,
        slug: p.slug,
        title: decodeHtmlEntities(p.title?.rendered || ""),
        content: p.content?.rendered || "",
        featuredImage,
        gallery,
        client: p.project_client || p.project_date || p.meta?.project_date || p.client || p.acf?.client || "",
        size: p.project_size || p.meta?.project_size || p.size || p.acf?.size || "",
        location: p.project_location || p.meta?.project_location || p.location || p.acf?.location || "",
        downloadUrl: p.project_download_url || p.meta?.project_download_url || p.downloadUrl || p.acf?.downloadUrl || "",
        customCategory: p.project_custom_category || p.meta?.project_custom_category || p.customCategory || p.acf?.customCategory || "",
        isEvent: p.project_category?.includes(13) || false,
        projectCategory: p.project_category || [],
      });
    }

    return projects;
  } catch (err) {
    console.error("Error in getExhibitionProjects:", err);
    return [];
  }
}

export async function getEventsProjects(): Promise<InteriorProject[]> {
  try {
    const res = await fetch("https://samaproductionme.com/wp-json/wp/v2/project?project_category=13&per_page=100", {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return [];
    const rawProjects = await res.json();

    const projects: InteriorProject[] = [];
    for (const p of rawProjects) {
      let featuredImage = "";
      if (p.featured_media) {
        const featRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media/${p.featured_media}`);
        if (featRes.ok) {
          const featMedia = await featRes.json();
          featuredImage = mapWpUrl(featMedia.source_url);
        }
      }

      const mediaRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media?parent=${p.id}&per_page=100`, {
        next: { revalidate: REVALIDATE_VAL },
      });
      let gallery: string[] = [];
      if (mediaRes.ok) {
        const mediaItems = await mediaRes.json();
        gallery = mediaItems.map((m: any) => mapWpUrl(m.source_url));
      }

      if (gallery.length === 0 && featuredImage) {
        gallery = [featuredImage];
      }

      projects.push({
        id: p.id,
        slug: p.slug,
        title: decodeHtmlEntities(p.title?.rendered || ""),
        content: p.content?.rendered || "",
        featuredImage,
        gallery,
        client: p.project_client || p.project_date || p.meta?.project_date || p.client || p.acf?.client || "",
        size: p.project_size || p.meta?.project_size || p.size || p.acf?.size || "",
        location: p.project_location || p.meta?.project_location || p.location || p.acf?.location || "",
        downloadUrl: p.project_download_url || p.meta?.project_download_url || p.downloadUrl || p.acf?.downloadUrl || "",
        customCategory: p.project_custom_category || p.meta?.project_custom_category || p.customCategory || p.acf?.customCategory || "",
        isEvent: true,
        projectCategory: p.project_category || [],
      });
    }

    return projects;
  } catch (err) {
    console.error("Error in getEventsProjects:", err);
    return [];
  }
}

export async function getMallActivationProjects(): Promise<InteriorProject[]> {
  try {
    const res = await fetch("https://samaproductionme.com/wp-json/wp/v2/project?project_category=14&per_page=100", {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return [];
    const rawProjects = await res.json();

    const projects: InteriorProject[] = [];
    for (const p of rawProjects) {
      let featuredImage = "";
      if (p.featured_media) {
        const featRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media/${p.featured_media}`);
        if (featRes.ok) {
          const featMedia = await featRes.json();
          featuredImage = mapWpUrl(featMedia.source_url);
        }
      }

      const mediaRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media?parent=${p.id}&per_page=100`, {
        next: { revalidate: REVALIDATE_VAL },
      });
      let gallery: string[] = [];
      if (mediaRes.ok) {
        const mediaItems = await mediaRes.json();
        gallery = mediaItems.map((m: any) => mapWpUrl(m.source_url));
      }

      if (gallery.length === 0 && featuredImage) {
        gallery = [featuredImage];
      }

      projects.push({
        id: p.id,
        slug: p.slug,
        title: decodeHtmlEntities(p.title?.rendered || ""),
        content: p.content?.rendered || "",
        featuredImage,
        gallery,
        client: p.project_client || p.project_date || p.meta?.project_date || p.client || p.acf?.client || "",
        size: p.project_size || p.meta?.project_size || p.size || p.acf?.size || "",
        location: p.project_location || p.meta?.project_location || p.location || p.acf?.location || "",
        downloadUrl: p.project_download_url || p.meta?.project_download_url || p.downloadUrl || p.acf?.downloadUrl || "",
        customCategory: p.project_custom_category || p.meta?.project_custom_category || p.customCategory || p.acf?.customCategory || "",
        isEvent: p.project_category?.includes(13) || false,
        projectCategory: p.project_category || [],
      });
    }

    return projects;
  } catch (err) {
    console.error("Error in getMallActivationProjects:", err);
    return [];
  }
}

export interface PartnerLogo {
  src: string;
  alt: string;
}

export interface PartnersPageData {
  title: string;
  description: string;
  logos: PartnerLogo[];
}

const FALLBACK_PARTNERS_LOGOS: PartnerLogo[] = [
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-44.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-21-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/DHL-preview.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-23-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-45.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-25-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-26-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-27-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-28-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-29-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-30-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-31-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-47.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-33-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-35-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-36-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-37-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-38-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-39-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-40-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-41-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-42-Vectorized.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/ChatGPT-Image-May-1-2026-07_15_33-PM-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/illy-preview.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/05/image-43.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Rectangle-Vectorized-3.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/image-51-Vectorized-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-1-11-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/white_omni.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Rectangle-Vectorized-4.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-4-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-5-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-6-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-7-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-8-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-9-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/white_mastercard.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/white_rta.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-12-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-21-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-13-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-14-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/white_pg.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-17-2.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Asset-20-1-1.png", alt: "Client Logo" },
  { src: "https://samaproductionme.com/wp-content/uploads/2026/06/Rectangle-Vectorized-5.png", alt: "Client Logo" }
];

export async function getPartnersPageData(): Promise<PartnersPageData> {
  const url = "https://samaproductionme.com/wp-json/wp/v2/pages/1893";
  const fallback: PartnersPageData = {
    title: "Partners",
    description: "Our clients include leading global brands who trust us to deliver refined, high-quality environments that elevate their presence and reflect their identity with excellence.",
    logos: FALLBACK_PARTNERS_LOGOS,
  };

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) {
      console.warn(`Failed to fetch partners page data: ${res.statusText}. Using fallback.`);
      return fallback;
    }
    const page = await res.json();
    const html = page.content?.rendered || "";
    if (!html) return fallback;

    let title = "Partners";
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (titleMatch) {
      title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
    } else if (page.title?.rendered) {
      title = page.title.rendered;
    }

    let description = fallback.description;
    const descMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (descMatch) {
      description = descMatch[0].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    }

    const imgRegex = /<img[^>]+src="([^"]+)"/g;
    let match;
    const parsedLogos: PartnerLogo[] = [];

    const galleryParts = html.split(/class="[^"]*gallery[^"]*"/i);
    const targetHtml = galleryParts.length > 1 ? galleryParts[1] : html;

    while ((match = imgRegex.exec(targetHtml)) !== null) {
      const src = mapWpUrl(match[1]);
      if (src && !src.includes("project-line") && !src.includes("Line-") && !src.includes("sama-logo-white")) {
        const imgTag = match[0];
        const altMatch = imgTag.match(/alt="([^"]*)"/i);
        const alt = altMatch && altMatch[1] ? altMatch[1].trim() : "Partner Logo";
        if (!parsedLogos.some(l => l.src === src)) {
          parsedLogos.push({ src, alt });
        }
      }
    }

    return {
      title,
      description,
      logos: parsedLogos.length > 0 ? parsedLogos : fallback.logos,
    };
  } catch (err) {
    console.error("Error fetching partners page data:", err);
    return fallback;
  }
}

export async function getPageBySlug(slug: string): Promise<{ title: string; content: string } | null> {
  const url = `https://samaproductionme.com/wp-json/wp/v2/pages?slug=${slug}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return null;
    const pages = await res.json();
    if (pages.length === 0) return null;
    return {
      title: decodeHtmlEntities(pages[0].title?.rendered || ""),
      content: pages[0].content?.rendered || "",
    };
  } catch (err) {
    console.error(`Error fetching page by slug ${slug}:`, err);
    return null;
  }
}

import type { Metadata } from "next";

export function mapYoastToMetadata(yoastJson: any): Metadata {
  if (!yoastJson) return {};

  const openGraph: any = {};
  if (yoastJson.og_title) openGraph.title = yoastJson.og_title;
  if (yoastJson.og_description) openGraph.description = yoastJson.og_description;
  if (yoastJson.og_url) openGraph.url = yoastJson.og_url;
  if (yoastJson.og_site_name) openGraph.siteName = yoastJson.og_site_name;
  if (yoastJson.og_type) openGraph.type = yoastJson.og_type;
  if (yoastJson.og_locale) openGraph.locale = yoastJson.og_locale;
  
  if (yoastJson.og_image && Array.isArray(yoastJson.og_image)) {
    openGraph.images = yoastJson.og_image.map((img: any) => ({
      url: img.url,
      width: img.width,
      height: img.height,
      alt: yoastJson.og_title || yoastJson.title,
    }));
  }

  const robots: any = {};
  if (yoastJson.robots) {
    if (yoastJson.robots.index) {
      robots.index = yoastJson.robots.index === "index";
    }
    if (yoastJson.robots.follow) {
      robots.follow = yoastJson.robots.follow === "follow";
    }
  }

  const twitter: any = {};
  if (yoastJson.twitter_card) {
    twitter.card = yoastJson.twitter_card;
  }
  if (yoastJson.og_title) twitter.title = yoastJson.og_title;
  if (yoastJson.og_description) twitter.description = yoastJson.og_description;
  if (yoastJson.og_image && Array.isArray(yoastJson.og_image) && yoastJson.og_image[0]) {
    twitter.images = [yoastJson.og_image[0].url];
  }

  return {
    title: yoastJson.title,
    description: yoastJson.description || yoastJson.og_description,
    alternates: yoastJson.canonical ? { canonical: yoastJson.canonical } : undefined,
    openGraph: Object.keys(openGraph).length > 0 ? openGraph : undefined,
    robots: Object.keys(robots).length > 0 ? robots : undefined,
    twitter: Object.keys(twitter).length > 0 ? twitter : undefined,
  };
}

export async function getPageMetadata(id: number): Promise<Metadata> {
  const url = `https://samaproductionme.com/wp-json/wp/v2/pages/${id}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return {};
    const page = await res.json();
    return mapYoastToMetadata(page.yoast_head_json);
  } catch (err) {
    console.error(`Error fetching Yoast SEO metadata for page ${id}:`, err);
    return {};
  }
}

export async function getPageMetadataBySlug(slug: string): Promise<Metadata> {
  const url = `https://samaproductionme.com/wp-json/wp/v2/pages?slug=${slug}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_VAL },
    });
    if (!res.ok) return {};
    const pages = await res.json();
    if (pages.length === 0) return {};
    return mapYoastToMetadata(pages[0].yoast_head_json);
  } catch (err) {
    console.error(`Error fetching Yoast SEO metadata for page slug ${slug}:`, err);
    return {};
  }
}

export interface FooterSocialLinks {
  linkedin: string;
  whatsapp: string;
  facebook: string;
}

export async function getFooterSocialLinks(): Promise<FooterSocialLinks> {
  const fallback = {
    linkedin: "https://ae.linkedin.com/company/samaproductiondxb",
    whatsapp: "https://wa.me/971561189670",
    facebook: "https://www.facebook.com/share/1CkesXNZ5H/?mibextid=wwXIfr"
  };

  try {
    const res = await fetch("https://samaproductionme.com/", {
      next: { revalidate: REVALIDATE_VAL },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return fallback;
    const html = await res.text();

    const linkedinMatch = html.match(/href="([^"]*(?:linkedin\.com\/company\/)[^"]*)"/i);
    const whatsappMatch = html.match(/href="([^"]*(?:wa\.me\/|api\.whatsapp\.com\/send)[^"]*)"/i);
    const facebookMatch = html.match(/href="([^"]*(?:facebook\.com\/)[^"]*)"/i);

    return {
      linkedin: linkedinMatch ? linkedinMatch[1].trim() : fallback.linkedin,
      whatsapp: whatsappMatch ? whatsappMatch[1].trim() : fallback.whatsapp,
      facebook: facebookMatch ? facebookMatch[1].trim() : fallback.facebook,
    };
  } catch (err) {
    console.error("Error fetching footer social links:", err);
    return fallback;
  }
}


