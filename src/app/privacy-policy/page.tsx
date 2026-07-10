import Link from "next/link";
import Footer from "../../components/Footer";
import { getPageBySlug, getPageMetadataBySlug } from "../../lib/wordpress";

export const revalidate = 3600;

export async function generateMetadata() {
  const yoast = await getPageMetadataBySlug("privacy-policy");
  if (yoast.title) return yoast;
  return {
    title: "Privacy Policy – SAMA Production",
    description: "Learn more about SAMA Production's privacy policies and how we protect your personal data.",
  };
}

export default async function PrivacyPolicyPage() {
  const pageData = await getPageBySlug("privacy-policy");

  // Fallback content in case WordPress fetch fails or returns empty
  const fallbackTitle = "Privacy Policy";
  const fallbackContent = `
    <h2>Interpretation and Definitions</h2>
    <h3>Interpretation</h3>
    <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
    
    <h3>Definitions</h3>
    <p>For the purposes of this Privacy Policy:</p>
    <ul>
      <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
      <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
      <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to SAMA PRODUCTION DECORATION DESIGN & IMPLEMENTATION, 77 St. Dubai Investment Park2, P.O.Box 449020, Dubai, UAE.</li>
      <li><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
      <li><strong>Country</strong> refers to: United Arab Emirates</li>
      <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
      <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual. We use "Personal Data" and "Personal Information" interchangeably unless a law uses a specific term.</li>
    </ul>
  `;

  const title = pageData?.title || fallbackTitle;
  let rawContent = pageData?.content || fallbackContent;

  // Split content into intro paragraphs (if matching typical WP format) and the rest
  // This allows us to style the top intro section on the green background, and the rest on the cream background
  let introHtml = "";
  let bodyHtml = rawContent;

  // Try to extract the first 1-2 paragraphs as intro if they look like the standard disclaimer
  const pTags = rawContent.match(/<p>([\s\S]*?)<\/p>/gi);
  if (pTags && pTags.length >= 2 && pTags[0].includes("describes Our policies") || (pTags && pTags.length >= 1 && pTags[0].includes("Privacy Policy"))) {
    // If it looks like typical privacy intro text
    const introCount = Math.min(2, pTags.length);
    const intros = pTags.slice(0, introCount);
    introHtml = intros.join("\n");
    bodyHtml = rawContent.replace(intros.join(""), "");
  }

  // If no clear intro found, we can put a default matching intro on the green background
  if (!introHtml) {
    introHtml = `
      <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
      <p>We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the Privacy Policy Generator.</p>
    `;
  }

  // Clean up any duplicate elements that might be prepended in the WordPress editor page content
  // (like header navigation or titles that we already render in the green hero header).
  // We do NOT use the global 'g' flag for titles or back links to ensure we only strip the first occurrence 
  // at the top of the page, and we do NOT target <p> tags containing "Privacy Policy" since the text body 
  // naturally mentions it many times.
  bodyHtml = bodyHtml
    // Remove the first list item containing "Back to Home"
    .replace(/<li[^>]*>[\s\S]*?Back to Home[\s\S]*?<\/li>/i, "")
    // Remove the first raw anchor containing "Back to Home"
    .replace(/<a[^>]*>[\s\S]*?Back to Home[\s\S]*?<\/a>/i, "")
    // Remove the first header containing "Privacy Policy" (this is the duplicated title)
    .replace(/<h[1-6][^>]*>[\s\S]*?Privacy Policy[\s\S]*?<\/h[1-6]>/i, "")
    // Clean up empty lists that might be left over
    .replace(/<ul[^>]*>\s*<\/ul>/gi, "")
    .trim();

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* ─── HEADER SECTION (Green Background) ─── */}
      <section className="w-full bg-[#5A6B54] text-white pt-24 pb-16 px-6 sm:px-10 md:px-16 flex flex-col items-center text-center">
        <div className="w-full max-w-4xl flex flex-col items-center">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="font-ivymode text-xs sm:text-sm tracking-wider hover:text-[#E5D9C4] transition-colors duration-300 mb-8 inline-flex items-center gap-2 uppercase"
          >
            <span>&larr;</span> Back to Home
          </Link>

          {/* Page Title */}
          <h1 className="font-ivymode font-normal text-4xl sm:text-5xl md:text-6xl text-white mb-8 tracking-wide leading-tight">
            {title}
          </h1>

          {/* Intro Paragraphs */}
          <div 
            className="font-ivymode text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl space-y-6"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
        </div>
      </section>

      {/* ─── BODY SECTION (Cream Background) ─── */}
      <section className="w-full py-16 px-6 sm:px-10 md:px-16 flex-grow">
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Privacy Policy Content */}
          <div 
            className="privacy-content font-ivymode text-sm sm:text-base text-[#563320] leading-relaxed space-y-8 [&_h2]:font-ivymode [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:text-[#563320] [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:border-b [&_h2]:border-[#563320]/15 [&_h2]:pb-3 [&_h3]:font-ivymode [&_h3]:text-2xl [&_h3]:font-normal [&_h3]:text-[#563320] [&_h3]:mt-8 [&_h3]:mb-4 [&_p]:mb-5 [&_p]:opacity-95 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:mb-2 [&_li]:leading-relaxed [&_li]:opacity-95 [&_strong]:text-[#563320] [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <Footer />
    </div>
  );
}
