import Image from "next/image";
import Link from "next/link";
import ReachOutSection from "../../../components/ReachOutSection";
import Footer from "../../../components/Footer";
import GalleryScrollButton from "../../../components/GalleryScrollButton";
import {
  getInteriorProjects,
  getExhibitionProjects,
  getEventsProjects,
  getMallActivationProjects,
  getProjectBySlug,
  getHomepageData,
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

  return (
    <div className="relative w-full min-h-screen bg-[#7C8C70] font-ivymode flex flex-col">
      
      <div className="w-full bg-gradient-to-b from-[#7C8C70] via-[#563320] to-white">
        {/* ─── MAIN CONTENT CONTAINER ─── */}
        <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto pt-24 sm:pt-32 pb-24">
          
          {/* ─── HERO IMAGE ─── */}
          {project.featuredImage && (
            <div className="w-full relative aspect-[21/9] sm:aspect-[2/1] md:aspect-[2.4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-8">
              <Image
                src={project.featuredImage}
                alt={project.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}

          {/* ─── BREADCRUMB ─── */}
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-[#E5D9C4]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <p className="font-ivymode text-sm text-[#E5D9C4] tracking-wider">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/projects" className="hover:text-white transition-colors">Interior</Link>
            </p>
          </div>

          {/* ─── TITLE ─── */}
          <h1 className="font-ivymode text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] text-[#E5D9C4] leading-[1] font-normal mb-10 sm:mb-14">
            {project.title}
          </h1>

          {/* ─── 3-COLUMN GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.5fr] gap-10 md:gap-8 lg:gap-16">
            
            {/* LEFT WRAPPER (Meta & Desc) */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] border-t border-[#E5D9C4]/40 pt-8">
              
              {/* COLUMN 1: META */}
              <div className="flex flex-col border-b md:border-b-0 border-[#E5D9C4]/20 md:border-r md:border-[#E5D9C4]/20 pr-0 md:pr-6 pb-6 md:pb-0 mb-6 md:mb-0 gap-8">
                <div className="flex flex-col">
                  <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Client</span>
                  <span className="font-ivymode text-sm md:text-base text-white tracking-wider uppercase">{project.title}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Size</span>
                  <span className="font-ivymode text-sm md:text-base text-white tracking-wider">140 Sqm</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-ivymode text-[1.75rem] text-[#E5D9C4] mb-1">Location</span>
                  <span className="font-ivymode text-sm md:text-base text-white tracking-wider uppercase">DIFC</span>
                </div>
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
                    href="https://samaproductionme.com/wp-content/uploads/2026/04/SAMA-Production-Portfolio.pdf" 
                    target="_blank" 
                    rel="noreferrer"
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

            {/* COLUMN 3: GALLERY (Vertical CSS Slider without visible scrollbar) */}
            <div 
              data-lenis-prevent
              className="gallery-container flex flex-col gap-6 w-full overflow-y-auto snap-y snap-mandatory relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ aspectRatio: '1 / 1.7' }}
            >
              {gallery.map((mediaUrl, i) => {
                const isVideo = mediaUrl.toLowerCase().endsWith('.mp4') || mediaUrl.toLowerCase().endsWith('.webm');
                
                return (
                  <div 
                    key={i} 
                    className="relative w-full shrink-0 aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-[#E5D9C4]/10 group snap-start bg-black/10"
                  >
                    {isVideo ? (
                      <video
                        src={mediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt={`${project.title} gallery ${i}`}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}
                  </div>
                );
              })}
              
              {/* Scroll indicator overlay pinned to the bottom of the container */}
              {gallery.length > 1 && (
                <GalleryScrollButton />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ─── REACH OUT & FOOTER ─── */}
      <ReachOutSection data={reachOut} />
      <Footer />
    </div>
  );
}
