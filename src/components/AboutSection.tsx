import Image from "next/image";

export default function AboutSection({ data }: { data?: { sectionName: string; title: string; description: string; image: string } }) {
  const sectionName = data?.sectionName || "about us";
  const title = data?.title || "SAMA";
  const description = data?.description || "SAMA Production is a multidisciplinary design and build studio known for crafting refined, high-impact environments across interiors, exhibitions, and brand activations. Defined by precision, material sophistication, and architectural clarity, each project is meticulously executed to embody brand identity at the highest level.";
  const image = data?.image || "/uploads/2026/05/about_us_video.png";

  return (
    <section className="relative w-full min-h-screen bg-[#7C8C70] p-6 sm:p-10 md:p-14 lg:p-16 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[60%] mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 py-12">
        
        {/* Left Content Side */}
        <div className="w-full md:w-[54%] flex flex-col items-start relative z-10">
          
          {/* Rotated Vertical Label */}
          <div className="h-28 sm:h-36 flex items-end justify-start select-none mb-6 relative pl-[1px]">
            <span className="font-ivymode text-xs sm:text-sm tracking-[0.35em] text-[#E5D9C4]/70 uppercase rotate-[-90deg] origin-bottom-left translate-x-[4px] -translate-y-[10px] whitespace-nowrap block">
              {sectionName}
            </span>
          </div>

          {/* SAMA Heading - overlaps the right image with z-20 */}
          <h2 className="font-ivymode font-normal text-[5.5rem] sm:text-[7.5rem] md:text-[9rem] lg:text-[10.5rem] xl:text-[12.5rem] text-[#E5D9C4] leading-[0.8] select-none z-20 whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] mb-6 sm:mb-8">
            {title}
          </h2>

          {/* Left Vertical Divider Line */}
          <div className="w-[1px] h-20 sm:h-28 bg-white/20 mb-8 sm:mb-10 ml-2" />

          {/* Paragraph block */}
          <p className="font-ivymode text-sm sm:text-base text-[#F3F3F3] leading-relaxed tracking-wide max-w-md md:max-w-lg mb-8 sm:mb-10">
            {description}
          </p>

          {/* Know More Button */}
          <div>
            <a 
              href="#about"
              className="group/btn inline-flex items-center gap-3 border border-[#E5D9C4]/40 hover:border-white px-6 py-2.5 rounded-full font-ivymode text-xs sm:text-sm text-[#E5D9C4] hover:text-white uppercase tracking-widest transition-all duration-300 bg-transparent hover:bg-white/5"
            >
              <span>Know More</span>
              <span className="inline-flex items-center justify-center border border-[#E5D9C4]/40 group-hover/btn:border-white rounded-full w-5 h-5 transition-all duration-300">
                <svg 
                  width="8" 
                  height="8" 
                  viewBox="0 0 8 8" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                >
                  <path 
                    d="M1 7L7 1M7 1H2.5M7 1V5.5" 
                    stroke="currentColor" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
          
        </div>

        {/* Right Image Side */}
        <div className="w-full md:w-[50%] flex justify-center z-0 relative">
          <div className="relative w-full aspect-[2/3] sm:aspect-square md:aspect-[2/3] max-w-sm md:max-w-none overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] md:rounded-[4.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-[#2b2a22]">
            <Image
              src={image}
              alt="SAMA Production Design Concept"
              fill
              priority
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover object-center filter contrast-[1.03]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
