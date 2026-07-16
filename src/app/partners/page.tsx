import Image from "next/image";
import Link from "next/link";
import ReachOutSection from "../../components/ReachOutSection";
import Footer from "../../components/Footer";
import { RevealText, FadeUp, StaggerReveal } from "../../components/animations";
import { getPartnersPageData, getHomepageData, getPageMetadata } from "../../lib/wordpress";

export const revalidate = 3600;

export async function generateMetadata() {
  return getPageMetadata(1893);
}

export default async function PartnersPage() {
  const [pageData, homepageData] = await Promise.all([
    getPartnersPageData(),
    getHomepageData(),
  ]);
  const { title, description, logos } = pageData;
  const { reachOut } = homepageData;

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      <div 
        className="flex flex-col pt-32 flex-grow"
        style={{ background: 'linear-gradient(180deg, #778065 0%, #778065 80%, #DAC6AE 100%)' }}
      >
      {/* Header section (Centered) */}
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto flex flex-col items-center text-center pb-10">
        
        {/* Title */}
        <RevealText as="h1" delay={0.2} type="words" className="font-ivymode font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-tight mb-6 tracking-wide select-none">
          {title}
        </RevealText>
        
        {/* Description */}
        <FadeUp as="p" delay={0.4} className="font-ivymode text-sm sm:text-base md:text-lg text-white/90 max-w-3xl leading-relaxed tracking-wide mb-8">
          {description}
        </FadeUp>
        
        {/* Breadcrumb with Home Icon */}
        <FadeUp delay={0.6} className="select-none flex items-center justify-center gap-2 font-ivymode text-xs sm:text-sm text-[#DAC6AE] tracking-widest uppercase mb-10">
          <Link href="/" className="hover:text-white transition-colors duration-300 flex items-center gap-1.5 no-underline">
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="mb-0.5"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Home</span>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-[#DAC6AE] underline underline-offset-4 decoration-[#DAC6AE]/30">Partners</span>
        </FadeUp>

        {/* Thin Divider Line */}
        <FadeUp delay={0.8} className="w-full h-[1px] bg-white/20" />
      </div>

      {/* Logos Grid Section */}
      <section className="w-full pb-20 px-4 sm:px-8 md:px-12 lg:px-16 flex-grow">
        <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto">
          <StaggerReveal y={40} stagger={0.06} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {logos.map((logo, index) => (
              <div 
                key={index}
                className="relative aspect-[7/3] bg-white/5 border border-white/10 rounded-[10px] flex items-center justify-center p-4 hover:bg-white/10 hover:border-white/30 transition-all duration-500 group shadow-sm hover:shadow-md"
              >
                <div className="relative w-full h-full max-w-[85%] max-h-[80%] transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={logo.src}
                    alt={logo.alt || "Partner Logo"}
                    fill
                    sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 15vw"
                    className="object-contain object-center filter brightness-0 invert opacity-90 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>
      </div>

      {/* Spacer to fade to white before Reach Out Section */}
      <div 
        className="w-full h-24 sm:h-32 md:h-40"
        style={{ background: 'linear-gradient(180deg, #DAC6AE 0%, #FFFFFF 100%)' }}
      />

      {/* Reach Out Section */}
      <div className="w-full bg-white">
        <ReachOutSection data={reachOut} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
