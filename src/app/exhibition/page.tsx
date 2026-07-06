import Image from "next/image";
import Link from "next/link";
import ReachOutSection from "../../components/ReachOutSection";
import Footer from "../../components/Footer";
import { getExhibitionProjects, getHomepageData } from "../../lib/wordpress";

export const revalidate = 3600;

export const metadata = {
  title: "Exhibition Design & Build – SAMA Production",
  description: "A curated collection of exhibition design & build projects by SAMA Production.",
};

export default async function ExhibitionPage() {
  const [projects, homepageData] = await Promise.all([
    getExhibitionProjects(),
    getHomepageData(),
  ]);

  const { reachOut } = homepageData;

  return (
    <div className="relative w-full min-h-screen bg-[#8A6450]">
      {/* ─── HEADER ───────────────────────────────────────────── */}
      <div className="w-full pt-32 sm:pt-40 pb-8 px-4 flex flex-col items-center text-center max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto">
        <h1 className="font-ivymode font-normal text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] text-white leading-[1.1] select-none">
          Exhibition Design <span className="italic font-light">&</span> Build
        </h1>

        <p className="font-ivymode text-sm sm:text-base md:text-lg text-white mt-4 sm:mt-6 leading-relaxed tracking-wide max-w-4xl mx-auto">
          Our clients include leading global brands who trust us to deliver refined, high-quality environments that elevate their presence and reflect their identity with excellence.
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 font-ivymode text-sm sm:text-base text-white select-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <Link href="/" className="hover:text-white/80 transition-colors no-underline">Home</Link>
          <span className="mx-1 opacity-70">/</span>
          <span className="underline decoration-white/60 underline-offset-4">Exhibition Design Build</span>
        </div>
      </div>

      {/* Separator */}
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto h-[1px] bg-white/30 my-4 sm:my-8" />

      {/* ─── PROJECT GRID ───────────────────────────────────────────── */}
      <section className="relative w-full bg-gradient-to-b from-[#8A6450] via-[#6B4B38] to-white py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {projects.map((project, index) => {
              const isLastRow = index >= projects.length - (projects.length % 3 === 0 ? 3 : projects.length % 3);
              const titleColorClass = isLastRow ? "text-[#563320] hover:text-[#563320]/80" : "text-white hover:text-white/80";

              return (
                <article
                  key={project.id}
                  className="flex flex-col items-center text-center group"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "both",
                    animationName: "fadeInUp",
                    animationDuration: "0.8s"
                  }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="w-full block relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-lg shadow-black/20 hover:shadow-black/40 transition-shadow duration-500"
                    tabIndex={0}
                    aria-label={`View project: ${project.title}`}
                  >
                    <Image
                      src={project.featuredImage || "/uploads/2026/06/Frame-146-3-1.png"}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </Link>

                  <h3 className={`font-ivymode font-normal text-xl sm:text-2xl md:text-[28px] mt-5 sm:mt-6 transition-transform duration-300 group-hover:-translate-y-1 ${titleColorClass}`}>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="transition-colors duration-300 no-underline"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <div className="mt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 h-[38px]">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-block px-6 py-1.5 border border-[#563320]/30 rounded-full text-[#E5D9C4] uppercase tracking-wider font-ivymode bg-[#714230] hover:bg-[#563320] hover:text-white transition-colors duration-300 no-underline text-xs sm:text-sm shadow-sm"
                    >
                      View Project
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Call To Action Block */}
          <div className="w-full flex flex-col items-center justify-center gap-6 mt-16 text-center px-4">
            <p className="font-ivymode text-xl sm:text-2xl md:text-[28px] text-[#563320] tracking-wide max-w-none whitespace-nowrap">
              Take a closer look at our projects and capabilities.
            </p>
            <a
              href="/portfolio.pdf"
              download
              className="inline-flex items-center gap-2 bg-[#563320] hover:bg-[#402213] text-[#E5D9C4] font-ivymode text-xs sm:text-sm tracking-widest uppercase px-8 py-3.5 rounded-full shadow-[0_10px_30px_rgba(86,51,32,0.3)] transition-all duration-300 transform hover:translate-y-[-2px] no-underline"
            >
              <span>Download Portfolio</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-bounce"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <ReachOutSection data={reachOut} />
      <Footer />
    </div>
  );
}
