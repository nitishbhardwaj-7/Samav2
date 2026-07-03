"use client";

import Image from "next/image";

interface ReachOutSectionProps {
  data?: {
    title: string;
    image: string;
    phone: string;
    phoneRaw: string;
  };
}

export default function ReachOutSection({ data }: ReachOutSectionProps) {
  const title = data?.title || "Reach Out";
  const image = data?.image || "/uploads/2026/05/vertical-shot-dining-set-featuring-modern-chairs-a-2026-01-22-02-31-15-utc_1-1.png";
  const phone = data?.phone || "+971 4 320 0416";
  const phoneRaw = data?.phoneRaw || "+97143200416";

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[75%] mx-auto flex flex-col md:flex-row items-center md:items-start justify-center gap-12 md:gap-20 z-10">
        
        {/* Left Column: Image */}
        <div className="w-full md:w-[35%] flex justify-center">
          <div className="relative w-full max-w-[280px] aspect-[1/2] overflow-hidden rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] bg-[#2b2a22]">
            <Image
              src={image}
              alt="Reach Out Corridor"
              fill
              priority
              sizes="(max-w-768px) 100vw, 35vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Right Column: Contact Details & Form */}
        <div className="w-full md:w-[65%] flex flex-col items-start gap-8">
          {/* Headline */}
          <h2 className="font-ivymode font-normal text-4xl sm:text-5xl md:text-6xl text-[#563320] leading-tight select-none">
            {title}
          </h2>

          {/* Form */}
          <form className="w-full flex flex-col items-start gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="w-full flex flex-col sm:flex-row gap-6">
              {/* Name */}
              <div className="flex-1 flex flex-col gap-1">
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full bg-transparent border-b border-[#563320]/30 focus:border-[#563320] outline-none pb-2 font-ivymode text-sm text-[#563320] placeholder-[#563320]/50 transition-colors duration-300"
                />
              </div>
              {/* Email */}
              <div className="flex-1 flex flex-col gap-1">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-transparent border-b border-[#563320]/30 focus:border-[#563320] outline-none pb-2 font-ivymode text-sm text-[#563320] placeholder-[#563320]/50 transition-colors duration-300"
                />
              </div>
            </div>
            {/* Message */}
            <div className="w-full flex flex-col gap-1">
              <textarea 
                placeholder="Message" 
                rows={3}
                className="w-full bg-transparent border-b border-[#563320]/30 focus:border-[#563320] outline-none pb-2 font-ivymode text-sm text-[#563320] placeholder-[#563320]/50 transition-colors duration-300 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="bg-[#856555] hover:bg-[#563320] text-white font-ivymode text-sm tracking-widest uppercase px-12 py-3 transition-colors duration-300 select-none cursor-pointer"
            >
              submit
            </button>
          </form>

          {/* Divider & Phone Number */}
          <div className="w-full flex flex-col items-start gap-2">
            {/* Vertical Line with "or" */}
            <div className="flex flex-col items-start pl-3">
              <div className="w-[1px] h-10 bg-[#563320]/25" />
              <span className="font-ivymode text-base text-[#563320]/70 my-1 select-none">
                or
              </span>
              <div className="w-[1px] h-10 bg-[#563320]/25" />
            </div>

            {/* Phone */}
            <a 
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-3 font-ivymode text-lg sm:text-xl text-[#563320] hover:text-[#856555] transition-colors duration-300 mt-2"
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-[#563320]"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{phone}</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
