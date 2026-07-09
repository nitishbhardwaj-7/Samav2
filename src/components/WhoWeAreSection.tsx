import { RevealText, StaggerReveal } from "./animations";

interface Pillar {
  title: string;
  description: string;
}

interface WhoWeAreSectionProps {
  data: {
    title: string;
    pillars: Pillar[];
  };
}

export default function WhoWeAreSection({ data }: WhoWeAreSectionProps) {
  return (
    <section className="relative w-full py-20 sm:py-24 md:py-32 px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto flex flex-col items-center gap-12 sm:gap-16 z-10 text-[#F2EAE0]">

        {/* Section Title */}
        <div className="text-center">
          <RevealText delay={0.2} as="h2" className="font-ivymode font-normal text-3xl sm:text-4xl md:text-[3.25rem] text-[#F2EAE0] tracking-wide leading-tight select-none">
            {data.title}
          </RevealText>
        </div>

        {/* Pillars Grid */}
        <StaggerReveal y={50} stagger={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full items-stretch">
          {data.pillars.map((pillar, index) => {
            // Safe ampersand replacement for display compatibility
            const displayTitle = pillar.title.replace(/&amp;/g, "&");

            return (
              <div
                key={index}
                className="border border-[#F2EAE0]/25 rounded-[10px] bg-black/[0.04] px-6 py-12 sm:px-8 sm:py-16 md:py-20 flex flex-col items-center justify-start gap-8 text-center shadow-lg transition-all duration-300 hover:bg-black/[0.08]"
              >
                {/* Title styled with IvyMode */}
                <h3 className="font-ivymode text-2xl sm:text-[2.25rem] text-[#F2EAE0] font-normal leading-[1.25] tracking-wide max-w-[240px]">
                  {displayTitle}
                </h3>

                {/* Paragraph styled with IvyMode */}
                <p className="font-ivymode text-sm sm:text-base text-[#F2EAE0]/85 leading-[1.65] tracking-wide font-normal max-w-[280px]">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </StaggerReveal>

      </div>
    </section>
  );
}
