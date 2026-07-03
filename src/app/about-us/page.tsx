import Image from "next/image";
import AboutSection from "../../components/AboutSection";
import DesignSection from "../../components/DesignSection";
import WhoWeAreSection from "../../components/WhoWeAreSection";
import CertificationsSection from "../../components/CertificationsSection";
import ReachOutSection from "../../components/ReachOutSection";
import Footer from "../../components/Footer";
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
      <div className="relative w-full h-screen pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-8 md:pb-12 lg:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
        {/* Framed Hero Card */}
        <main className="group relative flex-1 w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] h-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#2b2a22]">
          
          {/* Background Image with Olive/Dark Overlay */}
          <div className="absolute inset-0 select-none">
            <Image
              src={hero.backgroundImage}
              alt="Vision that drives the craft"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter contrast-[1.05]"
            />
            {/* No dark overlay */}
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 select-none">
            <div className="flex flex-col items-center text-center">
              
              {/* VISION */}
              <h1 className="font-ivymode font-normal text-[4.5rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[9.5rem] xl:text-[11rem] tracking-normal leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {hero.title}
              </h1>

              {/* Enclosed THAT DRIVES THE */}
              <div className="flex flex-col items-center w-full my-2 md:my-4 max-w-[260px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                {/* Top Line */}
                <div className="w-full h-[1px] bg-white/50" />
                
                {/* Text */}
                <span className="font-ivymode text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-[0.1em] text-white/95 uppercase my-1 sm:my-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  {hero.middleText}
                </span>
                
                {/* Bottom Line */}
                <div className="w-full h-[1px] bg-white/50" />
              </div>

              {/* CRAFT */}
              <h2 className="font-ivymode font-normal text-[4rem] sm:text-[6rem] md:text-[7.5rem] lg:text-[9rem] xl:text-[10.5rem] tracking-tight group-hover:tracking-[0.22em] group-hover:mr-[-0.22em] transition-[letter-spacing,margin] duration-[1500ms] ease-out leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {hero.subtitle}
              </h2>
            </div>
          </div>

          {/* Bottom Right Quote */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 z-10 max-w-[180px] sm:max-w-[240px] md:max-w-[320px] text-right select-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out">
            <p className="font-ivymode italic text-xs sm:text-sm md:text-base text-white/90 leading-relaxed tracking-wide font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {hero.description}
            </p>
          </div>

        </main>
      </div>

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
