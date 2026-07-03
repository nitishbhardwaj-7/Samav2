import Image from "next/image";

interface ClientLogo {
  src: string;
  alt: string;
}

interface ClientsSectionProps {
  data?: {
    title: string;
    description: string;
    logos: ClientLogo[];
  };
}

export default function ClientsSection({ data }: ClientsSectionProps) {
  const title = data?.title || "Our Clients";
  const description = data?.description || "Our clients include leading global brands who trust us to deliver refined, high-quality environments that elevate their presence and reflect their identity with excellence.";
  const logos = data?.logos || [
    { src: "/uploads/2026/05/image-21-Vectorized-2.png", alt: "Eucerin Logo" },
    { src: "/uploads/2026/05/image-22-Vectorized-2.png", alt: "AMMT Logo" },
    { src: "/uploads/2026/05/image-23-Vectorized-2.png", alt: "Audi Logo" },
    { src: "/uploads/2026/05/image-24-Vectorized-1.png", alt: "Casio Logo" },
    { src: "/uploads/2026/05/Vector.png", alt: "DHL Logo" },
  ];

  const getLogoWidth = (src: string) => {
    if (src.includes("image-21-Vectorized-2") || src.includes("Eucerin")) return "w-28 sm:w-32 md:w-36";
    if (src.includes("image-22-Vectorized-2") || src.includes("AMMT")) return "w-16 sm:w-20 md:w-24";
    if (src.includes("image-23-Vectorized-2") || src.includes("Audi")) return "w-24 sm:w-28 md:w-32";
    if (src.includes("image-24-Vectorized-1") || src.includes("Casio")) return "w-28 sm:w-32 md:w-36";
    if (src.includes("Vector.png") || src.includes("DHL")) return "w-28 sm:w-32 md:w-36";
    return "w-24 sm:w-28 md:w-32"; // standard default size
  };

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] mx-auto flex flex-col items-center justify-center gap-12 md:gap-16 text-center z-10">
        
        {/* Title & Description */}
        <div className="flex flex-col items-center gap-4 max-w-3xl">
          <h2 className="font-ivymode font-normal text-3xl sm:text-4xl md:text-5xl text-[#563320] leading-tight select-none">
            {title}
          </h2>
          <p className="font-ivymode text-xs sm:text-sm md:text-base text-[#563320]/80 leading-relaxed tracking-wide max-w-2xl">
            {description}
          </p>
        </div>

        {/* Logos Grid */}
        <div className="w-full flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 py-4">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className={`relative h-10 sm:h-12 md:h-14 ${getLogoWidth(logo.src)} flex items-center justify-center filter brightness-90 sepia-[0.1] contrast-[0.9] hover:brightness-[0.7] transition-all duration-300`}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                priority
                sizes="(max-w-768px) 150px, 200px"
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>

        {/* Explore More Button */}
        <div>
          <a 
            href="#explore"
            className="group/btn inline-flex items-center gap-3 border border-[#563320]/40 hover:border-[#563320] px-6 py-2.5 rounded-full font-ivymode text-xs sm:text-sm text-[#563320] uppercase tracking-widest transition-all duration-300 bg-transparent hover:bg-[#563320]/5"
          >
            <span>Explore more</span>
            <span className="inline-flex items-center justify-center border border-[#563320]/40 group-hover/btn:border-[#563320] rounded-full w-5 h-5 transition-all duration-300">
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
    </section>
  );
}
