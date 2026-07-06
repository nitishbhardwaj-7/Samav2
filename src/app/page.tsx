import Image from "next/image";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import ClientsSection from "../components/ClientsSection";
import ReachOutSection from "../components/ReachOutSection";
import Footer from "../components/Footer";
import { getHomepageData } from "../lib/wordpress";

export default async function Home() {
  const wpData = await getHomepageData();
  const { hero, about, projects, clients, reachOut } = wpData;

  return (
    <div className="relative w-full min-h-screen bg-[#7C8C70]">

      {/* Section 1: Hero Section */}
      <div className="relative w-full h-screen pt-16 sm:pt-20 md:pt-24 pb-2 sm:pb-4 md:pb-6 lg:pb-8 flex flex-col items-center justify-center overflow-hidden">
        {/* Framed Hero Card */}
        <main className="group relative flex-1 w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] h-full overflow-hidden rounded-2xl bg-[#2b2a22]">
          
          {/* Background Image with Olive/Dark Overlay */}
          <div className="absolute inset-0 select-none">
            <Image
              src={hero.backgroundImage}
              alt="Spaces that speak for the brand"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter contrast-[1.05]"
            />
            {/* Green Overlay Filter */}
            <div className="absolute inset-0 bg-[#7C8C70]/50 mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#7C8C70]/20" />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 select-none">
            <div className="flex flex-col items-center text-center">
              
              {/* SPACES */}
              <h1 className="font-ivymode font-normal text-[4.5rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[9.5rem] xl:text-[11rem] tracking-normal leading-[0.9] drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                {hero.title}
              </h1>

              {/* Enclosed THAT SPEAK FOR THE */}
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

              {/* BRAND */}
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

      {/* Section 3: Projects Section */}
      <ProjectsSection data={projects} />

      {/* Section 4: Our Clients Section */}
      <ClientsSection data={clients} />

      {/* Section 5: Reach Out Section */}
      <ReachOutSection data={reachOut} />

      {/* Section 6: Footer */}
      <Footer />
    </div>
  );
}
