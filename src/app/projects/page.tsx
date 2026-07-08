import ReachOutSection from "../../components/ReachOutSection";
import Footer from "../../components/Footer";
import ProjectsSection from "../../components/ProjectsSection";
import { getHomepageData } from "../../lib/wordpress";

export const revalidate = 3600;

export const metadata = {
  title: "Projects – SAMA Production",
  description: "A curated selection of interiors that reflect our design philosophy.",
};

export default async function ProjectsPage() {
  const homepageData = await getHomepageData();
  const { projects, reachOut } = homepageData;

  return (
    <div className="relative w-full min-h-screen bg-[#7C8C70]">
      {/* ─── HEADER padding so the Navbar doesn't overlap the title. Solid background blends seamlessly into the section's gradient ─── */}
      <div className="pt-32 sm:pt-40">
        <ProjectsSection data={projects} />
      </div>

      <ReachOutSection data={reachOut} />
      <Footer />
    </div>
  );
}
