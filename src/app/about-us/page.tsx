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
      <AboutSection data={about} hideKnowMore={true} />

      {/* Shared Gradient Wrapper for Design and Who We Are */}
      <div 
        className="relative w-full"
        style={{ background: 'linear-gradient(180deg, #496449 0%, #714230 50%, #8B6759 80%, #DAC6AE 100%)' }}
      >
        {/* Section 3: Design Section */}
        <DesignSection data={designSection} />

        {/* Section 4: Who We Are Section */}
        <WhoWeAreSection data={whoWeAre} />
      </div>

      {/* Section 4.5: Certifications Section */}
      <CertificationsSection data={certificationsSection} />

      {/* Section 5: Reach Out Section */}
      <div className="w-full bg-white">
        <ReachOutSection data={reachOut} />
      </div>

      {/* Section 6: Footer */}
      <Footer />
    </div>
  );
}
