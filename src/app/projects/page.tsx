import ReachOutSection from "../../components/ReachOutSection";
import Footer from "../../components/Footer";
import ProjectsSection from "../../components/ProjectsSection";
import { getInteriorProjects, getHomepageData } from "../../lib/wordpress";

export const revalidate = 3600;

export const metadata = {
  title: "Projects – SAMA Production",
  description: "A curated selection of interiors that reflect our design philosophy.",
};

export default async function ProjectsPage() {
  const [rawProjects, homepageData] = await Promise.all([
    getInteriorProjects(),
    getHomepageData(),
  ]);

  const { reachOut } = homepageData;

  // Map InteriorProject[] to ProjectItem[] expected by ProjectsSection
  const mappedProjects = rawProjects.map((p, idx) => ({
    number: String(idx + 1).padStart(2, "0"),
    title: p.title,
    image: p.featuredImage || "/uploads/2026/06/Frame-146-3-1.png",
    link: `/projects/${p.slug}`,
  }));

  const projectsData = {
    title: "Projects",
    subtitle: "Spaces Brought to Life",
    description: "A curated selection of interiors that reflect our design philosophy, attention to detail, and regional expertise.",
    items: mappedProjects,
  };

  return (
    <div className="relative w-full min-h-screen bg-[#7C8C70]">
      {/* ─── HEADER padding so the Navbar doesn't overlap the title. Solid background blends seamlessly into the section's gradient ─── */}
      <div className="pt-32 sm:pt-40">
        <ProjectsSection data={projectsData} />
      </div>

      <ReachOutSection data={reachOut} />
      <Footer />
    </div>
  );
}
