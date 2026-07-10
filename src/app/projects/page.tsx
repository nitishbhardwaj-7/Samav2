import Footer from "../../components/Footer";
import ProjectsSection from "../../components/ProjectsSection";
import { getHomepageData, getPageMetadataBySlug } from "../../lib/wordpress";

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
  const homepageData = await getHomepageData();
  const { projects } = homepageData;

  return (
    <div className="relative w-full min-h-screen bg-[#778065]">
      {/* ─── HEADER padding so the Navbar doesn't overlap the title. Solid background blends seamlessly into the section's gradient ─── */}
      <div className="pt-32 sm:pt-40">
        <ProjectsSection data={projects} />
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
