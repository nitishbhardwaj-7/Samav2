export interface ProjectItem {
  number: string;
  title: string;
  image: string;
  link: string;
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
    image: "https://samaproductionme.com/wp-content/uploads/2026/05/about_us_video.png",
  },
  projects: {
    title: "Projects",
    subtitle: "Spaces Brought to Life",
    description: "A curated selection of interiors that reflect our design philosophy, attention to detail, and regional expertise.",
    items: [
      { number: "01", title: "Interior", image: "https://samaproductionme.com/wp-content/uploads/2026/06/interior-1-1.png", link: "/interior" },
      { number: "02", title: "Exhibition Design & Build", image: "https://samaproductionme.com/wp-content/uploads/2026/06/Exhibition-1-1.png", link: "/exhibition" },
      { number: "03", title: "Events", image: "https://samaproductionme.com/wp-content/uploads/2026/06/events-1-1.png", link: "#" },
      { number: "04", title: "Mall Activation & Travel Retail", image: "https://samaproductionme.com/wp-content/uploads/2026/06/Mall-Activation-1-1-2.png", link: "#" },
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

    // 3. Parse Projects
    const projectCards = html.split('<div class="proj-card');
    if (projectCards.length > 1) {
      const parsedItems: ProjectItem[] = [];
      for (let i = 1; i < projectCards.length; i++) {
        const cardHtml = projectCards[i];

        const numMatch = cardHtml.match(/class="proj-number-box">([^<]+)/);
        const titleMatch = cardHtml.match(/<h3><a[^>]*>([\s\S]*?)<\/a>/);
        const imgMatch = cardHtml.match(/<img[^>]+src="([^"]+)"/);
        const linkMatch = cardHtml.match(/class="proj-btn"><a href="([^"]+)"/);

        if (imgMatch) {
          let finalLink = "#";
          if (linkMatch) {
            const rawLink = linkMatch[1].trim();
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
    image: "https://samaproductionme.com/wp-content/uploads/2026/05/about_us_video.png",
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
}

export interface InteriorPageData {
  title: string;
  description: string;
  backgroundImage: string;
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

    return {
      title,
      description,
      backgroundImage,
    };
  } catch (err) {
    console.error(`Error fetching category page ${id} data:`, err);
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      backgroundImage: fallbackBg,
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
        client: p.client || p.meta?.client || p.acf?.client || "",
        size: p.size || p.meta?.size || p.acf?.size || "",
        location: p.location || p.meta?.location || p.acf?.location || "",
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
      client: p.client || p.meta?.client || p.acf?.client || "",
      size: p.size || p.meta?.size || p.acf?.size || "",
      location: p.location || p.meta?.location || p.acf?.location || "",
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
        client: p.client || p.meta?.client || p.acf?.client || "",
        size: p.size || p.meta?.size || p.acf?.size || "",
        location: p.location || p.meta?.location || p.acf?.location || "",
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
        client: p.client || p.meta?.client || p.acf?.client || "",
        size: p.size || p.meta?.size || p.acf?.size || "",
        location: p.location || p.meta?.location || p.acf?.location || "",
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
        client: p.client || p.meta?.client || p.acf?.client || "",
        size: p.size || p.meta?.size || p.acf?.size || "",
        location: p.location || p.meta?.location || p.acf?.location || "",
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

