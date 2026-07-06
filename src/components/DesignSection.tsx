import Image from "next/image";

interface DesignSectionProps {
  data?: {
    image: string;
    quote: string;
  };
}

export default function DesignSection({ data }: DesignSectionProps) {
  const image = data?.image || "https://samaproductionme.com/wp-content/uploads/2026/06/Mask-group2.png";
  const quote = data?.quote || ""

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#7C8C70] to-[#523225]">
      {/* Framed Card Wrapper */}
      <div className="group relative w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.3/1] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-[#2b2a22]">

        {/* Background Image with hover zoom */}
        <div className="absolute inset-0 select-none overflow-hidden">
          <Image
            src={image}
            alt="SAMA Design spaces background"
            fill
            priority
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-[1500ms] ease-out filter contrast-[1.02]"
          />
        </div>

        {/* Bottom Overlay Text Box */}
        <div className="absolute bottom-0 left-0 w-full py-6 px-6 sm:py-8 sm:px-10 md:py-10 md:px-12 flex items-center justify-start bg-black/40 backdrop-blur-sm">
          <p className="font-ivymode text-white/95 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed tracking-wide font-normal max-w-4xl text-left select-none">
            {quote}
          </p>
        </div>

      </div>
    </section>
  );
}
