import Image from "next/image";
import Link from "next/link";
import ReachOutSection from "../../../components/ReachOutSection";
import Footer from "../../../components/Footer";
import ProjectGallery from "../../../components/ProjectGallery";
import { RevealText, FadeUp } from "../../../components/animations";
import {
  getInteriorProjects,
  getExhibitionProjects,
  getEventsProjects,
  getMallActivationProjects,
  getProjectBySlug,
  getHomepageData,
  mapYoastToMetadata,
} from "../../../lib/wordpress";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const [interior, exhibition, events, mallActivation] = await Promise.all([
    getInteriorProjects(),
    getExhibitionProjects(),
    getEventsProjects(),
    getMallActivationProjects(),
  ]);
  const allProjects = [...interior, ...exhibition, ...events, ...mallActivation];
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  if (project.yoast_head_json) {
    const yoastMeta = mapYoastToMetadata(project.yoast_head_json);
    if (yoastMeta.title) return yoastMeta;
  }
  return {
    title: `${project.title} – Interior – SAMA Production`,
    description: project.content.replace(/<[^>]+>/g, "").slice(0, 155),
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [project, homepageData] = await Promise.all([
    getProjectBySlug(slug),
    getHomepageData(),
  ]);

  if (!project) notFound();

  const { reachOut } = homepageData;

  // Deduplicate gallery
  const seen = new Set<string>();
  const gallery: string[] = [];
  // For the gallery column, we don't include the featured image if it's already shown as the hero
  for (const img of project.gallery) {
    if (!seen.has(img) && img !== project.featuredImage) {
      seen.add(img);
      gallery.push(img);
    }
  }

  // Fallback if gallery is empty
  if (gallery.length === 0 && project.featuredImage) {
    gallery.push(project.featuredImage);
  }

  const isValidField = (val?: string | null) => {
    if (!val) return false;
    const lower = val.trim().toLowerCase();
    return lower !== "" && lower !== "n/a";
  };

  let categoryName = "Interior";
  let categoryLink = "/interior";

  if (project.projectCategory?.includes(8)) {
    categoryName = "Exhibition Design & Build";
    categoryLink = "/exhibition";
  } else if (project.projectCategory?.includes(13)) {
    categoryName = "Events";
    categoryLink = "/events";
  } else if (project.projectCategory?.includes(14)) {
    categoryName = "Mall Activation & Travel Retail";
    categoryLink = "/mall-activation-travel-retail";
  } else if (project.projectCategory?.includes(7)) {
    categoryName = "Interior";
    categoryLink = "/interior";
  }

  return (
    <div className="relative w-full min-h-screen bg-[#7C8C70] font-ivymode flex flex-col">

      <div className="w-full bg-gradient-to-b from-[#7C8C70] via-[#563320] to-white">
        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto pt-24 sm:pt-32 pb-24">

          {/* ─── HERO IMAGE ─── */}
          {project.featuredImage && (
            <div
              data-project-hero-wrap
              className="w-full relative aspect-[21/9] sm:aspect-[2/1] md:aspect-[2.4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-8"
            >
              <Image
                src={project.featuredImage}
                alt={project.title}
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}

          {/* ─── BREADCRUMB ─── */}
          <FadeUp delay={1.4} className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#E5D9C4]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <p className="font-ivymode text-sm text-[#E5D9C4] tracking-wider">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href={categoryLink} className="hover:text-white transition-colors">{categoryName}</Link>
            </p>
          </FadeUp>

          {/* ─── TITLE ─── */}
          <RevealText
            as="h1"
            type="words"
            delay={1.5}
            className="font-ivymode text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] text-[#E5D9C4] leading-[1] font-normal mb-10 sm:mb-14"
          >
            {project.title}
          </RevealText>

          {/* ─── 3-COLUMN GRID ─── */}
          <FadeUp delay={1.6} className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.5fr] gap-10 md:gap-8 lg:gap-16">

            {/* LEFT WRAPPER (Meta & Desc) */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] border-t border-[#E5D9C4]/40 pt-8">

              {/* COLUMN 1: META */}
              <div className="flex flex-col border-b md:border-b-0 border-[#E5D9C4]/20 md:border-r md:border-[#E5D9C4]/20 pr-0 md:pr-6 pb-6 md:pb-0 mb-6 md:mb-0 gap-8">
                {isValidField(project.client) && (
                  <div className="flex flex-col">
                    <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Client</span>
                    <span className="font-ivymode text-sm md:text-base text-white tracking-wider uppercase">{project.client}</span>
                  </div>
                )}

                {!project.isEvent ? (
                  isValidField(project.size) && (
                    <div className="flex flex-col">
                      <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Size</span>
                      <span className="font-ivymode text-sm md:text-base text-white tracking-wider">{project.size}</span>
                    </div>
                  )
                ) : (
                  <>
                    {isValidField(project.size) && (
                      <div className="flex flex-col">
                        <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Date</span>
                        <span className="font-ivymode text-sm md:text-base text-white tracking-wider">{project.size}</span>
                      </div>
                    )}
                    {isValidField(project.customCategory) && (
                      <div className="flex flex-col">
                        <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Category</span>
                        <span className="font-ivymode text-sm md:text-base text-white tracking-wider">{project.customCategory}</span>
                      </div>
                    )}
                  </>
                )}

                {isValidField(project.location) && (
                  <div className="flex flex-col">
                    <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Location</span>
                    <span className="font-ivymode text-sm md:text-base text-white tracking-wider uppercase">{project.location}</span>
                  </div>
                )}
              </div>

              {/* COLUMN 2: DESCRIPTION */}
              <div className="flex flex-col md:pl-8 lg:pl-12">
                <h2 className="font-ivymode text-[2.25rem] text-[#E5D9C4] mb-6">About the Project</h2>
                <div
                  className="font-ivymode text-sm md:text-base text-white/90 leading-relaxed space-y-4 mb-10"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />

                <div>
                  <a
                    href="/uploads/SAMA-Production-Portfolio.pdf"
                    download
                    className="inline-flex items-center gap-2 bg-[#714230] hover:bg-[#5a3220] transition-colors text-white font-ivymode px-6 py-3 rounded-full text-sm sm:text-base tracking-wide shadow-lg border border-[#E5D9C4]/20"
                  >
                    Download Portfolio
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* COLUMN 3: GALLERY */}
            <ProjectGallery gallery={gallery} projectTitle={project.title} />

          </FadeUp>
        </div>
      </div>

      {/* ─── REACH OUT & FOOTER ─── */}
      <div className="w-full bg-white">
        <ReachOutSection data={reachOut} />
      </div>
      <Footer />
    </div>
  );
}
