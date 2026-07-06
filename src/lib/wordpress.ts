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
      next: { revalidate: 3600 }, // Cache for 1 hour
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
    // Looking for: Elegant spaces crafted with purpose...
    const heroDescMatch = html.match(/Elegant spaces crafted with purpose[\s\S]*?<\/p>/);
    if (heroDescMatch) {
      data.hero.description = heroDescMatch[0]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 2. Parse About Section Description
    const aboutDescMatch = html.match(/SAMA Production is a multidisciplinary[\s\S]*?<\/p>/);
    if (aboutDescMatch) {
      data.about.description = aboutDescMatch[0]
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

          parsedItems.push({
            number: numMatch ? numMatch[1].trim() : `0${i}`,
            title: titleMatch
              ? decodeHtmlEntities(titleMatch[1].replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").trim())
              : "Project",
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
      next: { revalidate: 3600 }, // Cache for 1 hour
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

    // 1. Extract Hero Title parts (from VISION THAT DRIVES THE CRAFT)
    if (html.includes("THAT DRIVES THE")) {
      data.hero.title = "VISION";
      data.hero.middleText = "THAT DRIVES THE";
      data.hero.subtitle = "CRAFT";
    }

    // 2. Extract Hero Description/Quote
    const heroDescMatch = html.match(/Elegant spaces crafted with purpose[\s\S]*?<\/p>/);
    if (heroDescMatch) {
      data.hero.description = heroDescMatch[0]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 3. Extract About Section Description
    const aboutDescMatch = html.match(/SAMA Production is a multidisciplinary[\s\S]*?<\/p>/);
    if (aboutDescMatch) {
      data.about.description = aboutDescMatch[0]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 4. Extract Design Section Quote
    const designQuoteMatch = html.match(/“We design and build spaces[\s\S]*?”/i) || html.match(/We design and build spaces[^<]+/i);
    if (designQuoteMatch) {
      data.designSection.quote = designQuoteMatch[0]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    // 5. Extract Design Section Image
    const designImgMatch = html.match(/<img[^>]+src="([^"]+Mask-group[^"]+)"/i) || html.match(/<img[^>]+src="([^"]+)"/i);
    if (designImgMatch) {
      data.designSection.image = designImgMatch[1].trim();
    }

    // 6. Extract Who We Are Pillars
    const whoWeAreTitleMatch = html.match(/<h[1-6][^>]*>\s*Who We Are\s*<\/h[1-6]>/i);
    if (whoWeAreTitleMatch) {
      data.whoWeAre.title = "Who We Are";
    }

    const pillars = [];
    const parts = html.split(/<h[234]/);
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const endHeading = part.match(/<\/h[234]>/);
      if (!endHeading) continue;

      const titleHtml = part.substring(part.indexOf('>') + 1, endHeading.index);
      const title = titleHtml.replace(/<[^>]+>/g, "").trim().replace(/&amp;/g, "&");

      if (title.length < 50) {
        if (title.includes("Design Led") || title.includes("End to End") || title.includes("Craftsmanship")) {
          const afterHeading = part.substring(endHeading.index);
          const pMatch = afterHeading.match(/<p>([\s\S]*?)<\/p>/);
          if (pMatch) {
            const desc = pMatch[1].replace(/<[^>]+>/g, "").trim();
            pillars.push({ title, description: desc });
          }
        }
      }
    }
    if (pillars.length > 0) {
      data.whoWeAre.pillars = pillars;
    }

    // 7. Extract Certifications
    const certImages = [
      { key: "blue-certificates", defaultTitle: "2015 Quality Management System Certification" },
      { key: "2-230132", defaultTitle: "2018 Occupational Health & Safety Certification" },
      { key: "3-61", defaultTitle: "2015 Environmental Management Certification" }
    ];

    const certItems = certImages.map(item => {
      let image = "";
      let title = item.defaultTitle;

      const imgRegex = new RegExp(`<img[^>]+src="([^"]+${item.key}[^"]*)"`, "i");
      const imgMatch = html.match(imgRegex);
      if (imgMatch) {
        image = imgMatch[1].trim();
      } else {
        if (item.key === "blue-certificates") image = "https://samaproductionme.com/wp-content/uploads/2026/05/blue-certificates.png";
        else if (item.key === "2-230132") image = "https://samaproductionme.com/wp-content/uploads/2026/05/2-230132.png";
        else image = "https://samaproductionme.com/wp-content/uploads/2026/05/3-61.png";
      }

      const idx = html.indexOf(item.key);
      if (idx !== -1) {
        const afterImg = html.substring(idx, idx + 1000);
        const textMatch = afterImg.match(/>([^<]*Certification[^<]*)</i);
        if (textMatch) {
          title = textMatch[1].trim();
        }
      }

      return { image, title };
    });

    data.certificationsSection = {
      title: "Certifications",
      items: certItems
    };

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
}

export interface InteriorPageData {
  title: string;
  description: string;
  backgroundImage: string;
}

export async function getInteriorPageData(): Promise<InteriorPageData> {
  const url = "https://samaproductionme.com/wp-json/wp/v2/pages/472";
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return {
        title: "Interior",
        description: "Our clients include leading global brands who trust us to deliver refined, high-quality environments that elevate their presence.",
        backgroundImage: "https://samaproductionme.com/wp-content/uploads/2026/06/interior-1-1.png"
      };
    }
    const page = await res.json();
    const html = page.content?.rendered || "";

    // Extract description
    let description = "Our clients include leading global brands who trust us to deliver refined, high-quality environments.";
    const descMatch = html.match(/Our clients include leading global brands[\s\S]*?<\/p>/i);
    if (descMatch) {
      description = descMatch[0].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    }

    // Use the featured media of the page, or fallback
    let backgroundImage = "https://samaproductionme.com/wp-content/uploads/2026/06/interior-1-1.png";
    if (page.featured_media) {
      const mediaRes = await fetch(`https://samaproductionme.com/wp-json/wp/v2/media/${page.featured_media}`);
      if (mediaRes.ok) {
        const media = await mediaRes.json();
        backgroundImage = mapWpUrl(media.source_url);
      }
    } else {
      // Look for first large image in the html
      const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch) {
        backgroundImage = mapWpUrl(imgMatch[1]);
      }
    }

    return {
      title: decodeHtmlEntities(page.title?.rendered || "Interior"),
      description,
      backgroundImage
    };
  } catch (err) {
    console.error("Error fetching interior page data:", err);
    return {
      title: "Interior",
      description: "Our clients include leading global brands who trust us to deliver refined, high-quality environments.",
      backgroundImage: "https://samaproductionme.com/wp-content/uploads/2026/06/interior-1-1.png"
    };
  }
}

export async function getInteriorProjects(): Promise<InteriorProject[]> {
  try {
    const res = await fetch("https://samaproductionme.com/wp-json/wp/v2/project?project_category=7&per_page=100", {
      next: { revalidate: 3600 },
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
        next: { revalidate: 3600 },
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
        gallery
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
      next: { revalidate: 3600 },
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
      next: { revalidate: 3600 },
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
      gallery
    };
  } catch (err) {
    console.error(`Error fetching project by slug ${slug}:`, err);
    return null;
  }
}

export async function getExhibitionProjects(): Promise<InteriorProject[]> {
  try {
    const res = await fetch("https://samaproductionme.com/wp-json/wp/v2/project?project_category=8&per_page=100", {
      next: { revalidate: 3600 },
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
        next: { revalidate: 3600 },
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
        gallery
      });
    }

    return projects;
  } catch (err) {
    console.error("Error in getExhibitionProjects:", err);
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
      next: { revalidate: 3600 },
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
    const descMatch = html.match(/Our clients include leading global brands[\s\S]*?<\/p>/i);
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

