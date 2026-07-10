import Link from "next/link";
import Footer from "../../components/Footer";
import { getPageBySlug, getPageMetadataBySlug } from "../../lib/wordpress";

export const revalidate = 3600;

export async function generateMetadata() {
  const yoast = await getPageMetadataBySlug("terms-and-conditions");
  if (yoast.title) return yoast;
  return {
    title: "Terms & Conditions – SAMA Production",
    description: "Read the Terms and Conditions for using SAMA Production's website and services.",
  };
}

export default async function TermsAndConditionsPage() {
  const pageData = await getPageBySlug("terms-and-conditions");

  // Fallback content in case WordPress fetch fails or returns empty
  const fallbackTitle = "Terms and Conditions";
  const fallbackContent = `
    <h2>Interpretation and Definitions</h2>
    <h3>Interpretation</h3>
    <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
    
    <h3>Definitions</h3>
    <p>For the purposes of these Terms and Conditions:</p>
    <ul>
      <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
      <li><strong>Country</strong> refers to: United Arab Emirates</li>
      <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to SAMA PRODUCTION DECORATION DESIGN & IMPLEMENTATION, 77 St. Dubai Investment Park2, P.O.Box 449020, Dubai, UAE.</li>
      <li><strong>Device</strong> means any device that can access the Service such as a computer, a cell phone or a digital tablet.</li>
      <li><strong>Service</strong> refers to the Website.</li>
      <li><strong>Terms and Conditions</strong> (also referred to as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</li>
      <li><strong>Third-party Social Media Service</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</li>
      <li><strong>Website</strong> refers to SAMA Production, accessible from https://samaproductionme.com/</li>
      <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
    </ul>
  `;

  const title = pageData?.title || fallbackTitle;
  let rawContent = pageData?.content || fallbackContent;

  // Split content into intro paragraphs (if matching typical WP format) and the rest
  let introHtml = "";
  let bodyHtml = rawContent;

  // Try to extract the first paragraph as intro if it matches typical Terms intro text
  const pTags = rawContent.match(/<p>([\s\S]*?)<\/p>/gi);
  if (pTags && pTags.length >= 1 && (pTags[0].toLowerCase().includes("please read these terms") || pTags[0].toLowerCase().includes("before using"))) {
    const intros = pTags.slice(0, 1);
    introHtml = intros.join("\n");
    bodyHtml = rawContent.replace(intros.join(""), "");
  }

  // If no clear intro found, we can put a default matching intro on the green background
  if (!introHtml) {
    introHtml = `
      <p>Please read these terms and conditions carefully before using Our Service.</p>
    `;
  }

  // Clean up duplicate titles or nav links that might be prepended in the WordPress content block
  bodyHtml = bodyHtml
    // Remove the first list item containing "Back to Home"
    .replace(/<li[^>]*>[\s\S]*?Back to Home[\s\S]*?<\/li>/i, "")
    // Remove the first raw anchor containing "Back to Home"
    .replace(/<a[^>]*>[\s\S]*?Back to Home[\s\S]*?<\/a>/i, "")
    // Remove the first header containing "Terms and Conditions" or similar variation (duplicated title)
    .replace(/<h[1-6][^>]*>[\s\S]*?Terms[\s\S]*?And[\s\S]*?Conditions[\s\S]*?<\/h[1-6]>/i, "")
    .replace(/<h[1-6][^>]*>[\s\S]*?Terms[\s\S]*?&[\s\S]*?Conditions[\s\S]*?<\/h[1-6]>/i, "")
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
          {/* Main Terms and Conditions Content */}
          <div 
            className="terms-content font-ivymode text-sm sm:text-base text-[#563320] leading-relaxed space-y-8 [&_h2]:font-ivymode [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:text-[#563320] [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:border-b [&_h2]:border-[#563320]/15 [&_h2]:pb-3 [&_h3]:font-ivymode [&_h3]:text-2xl [&_h3]:font-normal [&_h3]:text-[#563320] [&_h3]:mt-8 [&_h3]:mb-4 [&_p]:mb-5 [&_p]:opacity-95 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_li]:mb-2 [&_li]:leading-relaxed [&_li]:opacity-95 [&_strong]:text-[#563320] [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <Footer />
    </div>
  );
}
