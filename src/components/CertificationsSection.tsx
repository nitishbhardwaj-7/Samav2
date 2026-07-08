import Image from "next/image";

interface CertItem {
  image: string;
  title: string;
}

interface CertificationsSectionProps {
  data: {
    title: string;
    items: CertItem[];
  };
}

export default function CertificationsSection({ data }: CertificationsSectionProps) {
  const title = data?.title || "Certifications";
  const items = data?.items || [];

  return (
    <section 
      className="relative w-full py-20 sm:py-24 md:py-32 px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #DAC6AE 0%, #DAC6AE 80%, #FFFFFF 100%)' }}
    >
      <div className="w-full max-w-[96%] xl:max-w-[90%] mx-auto flex flex-col items-center gap-12 sm:gap-16 z-10 text-[#F2EAE0]">
        
        {/* Section Title */}
        <div className="text-center">
          <h2 className="font-ivymode font-normal text-3xl sm:text-4xl md:text-[3.25rem] text-[#F2EAE0] tracking-wide leading-tight select-none">
            {title}
          </h2>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 w-full items-stretch">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-start gap-6 group">
              {/* Certificate Image Frame - Increased max-width to 420px */}
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] aspect-[1/1.4] overflow-hidden rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)] group-hover:scale-[1.02]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  className="object-contain object-center bg-white"
                />
              </div>

              {/* Caption Title */}
              <h3 className="font-ivymode text-base sm:text-lg md:text-xl lg:text-[1.35rem] text-[#523225] font-normal leading-[1.35] tracking-wide text-center max-w-[320px] select-none">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
