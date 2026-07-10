import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import ClientsSection from "../components/ClientsSection";
import ReachOutSection from "../components/ReachOutSection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { getHomepageData, getPageMetadata } from "../lib/wordpress";

export async function generateMetadata() {
  return getPageMetadata(7);
}

export default async function Home() {
  const wpData = await getHomepageData();
  const { hero, about, projects, clients, reachOut } = wpData;

  return (
    <div className="relative w-full min-h-screen bg-[#7C8C70]">

      {/* Section 1: Hero Section */}
      <HeroSection heroData={hero} />

      {/* Section 2: About Section */}
      <AboutSection data={about} />

      {/* Section 3: Projects Section */}
      <ProjectsSection data={projects} />

      {/* Section 4: Our Clients Section */}
      <ClientsSection data={clients} />

      {/* Section 5: Reach Out Section */}
      <div className="w-full bg-white">
        <ReachOutSection data={reachOut} />
      </div>

      {/* Section 6: Footer */}
      <Footer />
    </div>
  );
}
