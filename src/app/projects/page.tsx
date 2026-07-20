import ReachOutSection from "@/components/ReachOutSection";
import Footer from "../../components/Footer";
import ProjectsSection from "../../components/ProjectsSection";
import { getProjectsPageData, getPageMetadataBySlug } from "../../lib/wordpress";

export const revalidate = 3600;

export async function generateMetadata() {
  const yoast = await getPageMetadataBySlug("projects");
  if (yoast.title) return yoast;
  return {
    title: "Projects – SAMA Production",
    description: "A curated selection of interiors that reflect our design philosophy.",
  };
}

export default async function ProjectsPage() {
  const projectsData = await getProjectsPageData();

  return (
    <div className="relative w-full min-h-screen bg-[#496449]">
      {/* ─── HEADER padding so the Navbar doesn't overlap the title. Solid background blends seamlessly into the section's gradient ─── */}
      <div className="pt-20 sm:pt-24">
        <ProjectsSection
          data={projectsData.projects}
          headerData={projectsData.header}
          showArchiveHeader={true}
        />
      </div>


      {/* Spacer to fade to white before the footer */}
      <div
        className="w-full h-24 sm:h-32 md:h-40"
        style={{ background: 'linear-gradient(180deg, #DAC6AE 0%, #FFFFFF 100%)' }}
      />
      <Footer />
    </div>
  );
}
