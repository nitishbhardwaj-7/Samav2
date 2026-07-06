import Image from "next/image";
import AboutSection from "../../components/AboutSection";
import DesignSection from "../../components/DesignSection";
import WhoWeAreSection from "../../components/WhoWeAreSection";
import CertificationsSection from "../../components/CertificationsSection";
import ReachOutSection from "../../components/ReachOutSection";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import { getAboutPageData, getHomepageData } from "../../lib/wordpress";

export default async function AboutUsPage() {
  const [aboutData, homepageData] = await Promise.all([
    getAboutPageData(),
    getHomepageData(),
  ]);

  const { hero, about, designSection, whoWeAre, certificationsSection } = aboutData;
  const { reachOut } = homepageData;

  return (
    <div className="relative w-full min-h-screen bg-[#7C8C70]">
      {/* Section 1: Hero Section */}
      <HeroSection heroData={hero} />

      {/* Section 2: About Section */}
      <AboutSection data={about} />

      {/* Shared Gradient Wrapper for Design and Who We Are */}
      <div className="relative w-full bg-gradient-to-b from-[#7C8C70] via-[#523225] to-[#AC8872]">
        {/* Section 3: Design Section */}
        <DesignSection data={designSection} />

        {/* Section 4: Who We Are Section */}
        <WhoWeAreSection data={whoWeAre} />
      </div>

      {/* Section 4.5: Certifications Section */}
      <CertificationsSection data={certificationsSection} />

      {/* Section 5: Reach Out Section */}
      <ReachOutSection data={reachOut} />

      {/* Section 6: Footer */}
      <Footer />
    </div>
  );
}
