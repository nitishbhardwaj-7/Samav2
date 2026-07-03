import Image from "next/image";
import Link from "next/link";
import ReachOutSection from "../../components/ReachOutSection";
import Footer from "../../components/Footer";
import { getInteriorPageData, getInteriorProjects, getHomepageData } from "../../lib/wordpress";

export const revalidate = 3600;

export const metadata = {
  title: "Interior – SAMA Production",
  description: "A curated collection of interior design & build projects by SAMA Production.",
};

export default async function InteriorPage() {
  const [pageData, projects, homepageData] = await Promise.all([
    getInteriorPageData(),
    getInteriorProjects(),
    getHomepageData(),
  ]);

  const { title, description } = pageData;
  const { reachOut } = homepageData;

  return (
    <div className="relative w-full min-h-screen bg-[#2c211a]">
      {/* ─── HEADER (No hero image) ────────────────────────────────── */}
      <div className="w-full pt-32 pb-8 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 border-b border-white/10 max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="font-ivymode font-normal text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem] text-[#DAC6AE] leading-[0.85] select-none">
            {title}
          </h1>
          {/* Breadcrumb */}
          <div className="select-none">
            <p className="font-ivymode text-xs sm:text-sm text-[#DAC6AE]/60 tracking-widest uppercase">
              <Link href="/" className="hover:text-[#DAC6AE] transition-colors no-underline">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[#DAC6AE]">Interior</span>
            </p>
          </div>
        </div>
        <p className="font-ivymode text-sm sm:text-base md:text-lg text-[#DAC6AE]/70 max-w-sm leading-relaxed tracking-wide text-left sm:text-right">
          {description}
        </p>
      </div>

      {/* ─── PROJECT GRID ───────────────────────────────────────────── */}
      <section className="relative w-full py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto">
          {/* 4-column grid */}
          <div className="custom-project-grid cols-4">
            {projects.map((project, index) => (
              <article
                key={project.id}
                className="custom-project-item flex flex-col items-center text-center"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "both",
                  animationName: "fadeInUp",
                  animationDuration: "0.8s"
                }}
              >
                {/* Square image with hover zoom */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="w-full block"
                  tabIndex={0}
                  aria-label={`View project: ${project.title}`}
                >
                  <div className="custom-project-img-wrapper cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow duration-500">
                    <Image
                      src={project.featuredImage || "/uploads/2026/06/Frame-146-3-1.png"}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </Link>

                {/* Title */}
                <h3 
                  className="custom-project-title"
                  style={{ fontSize: "clamp(15px, 1.6vw, 28px)" }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-white/80 transition-colors duration-300 no-underline"
                  >
                    {project.title}
                  </Link>
                </h3>

                {/* "View Project" button */}
                <div className="custom-project-btn-wrapper mt-1" style={{ height: "38px" }}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="custom-project-btn inline-block px-6 py-1.5 border border-white/45 rounded-full text-[#DAC6AE] uppercase tracking-wider font-ivymode bg-[#714230] hover:text-white hover:border-white hover:bg-white/8 transition-all duration-300 no-underline"
                    style={{ fontSize: "clamp(12px, 1vw, 16px)" }}
                  >
                    View Project
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ReachOutSection data={reachOut} />
      <Footer />
    </div>
  );
}
