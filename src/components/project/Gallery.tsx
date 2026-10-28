"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import type { Picture, ViewsContent } from "@/content/types";

// True only in the browser. Swiper reads the clock while it renders, which can't happen
// while Next pre-builds the page, so the server sends a still row of the same photos instead.
const noSubscribe = () => () => {};
function useInBrowser() {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

/*
  Lead text, then a full-width row of photos that loops on its own
  (pauses while the pointer is over it; can also be dragged or swiped).
*/
export function Gallery({ content: views }: { content: ViewsContent }) {
  const inBrowser = useInBrowser();
  // The loop needs more slides than fit on screen, so the photos are listed twice.
  const slides = [...views.images, ...views.images];

  return (
    <section className="bg-white pt-[60px] md:pt-[200px]">
      <div className="grid grid-cols-1 px-5 md:grid-cols-12 md:gap-5">
        <p className="text-h2 md:col-span-6 md:col-start-7">{views.lead}</p>
      </div>

      {inBrowser ? (
        <Swiper
          modules={[Autoplay]}
          loop
          speed={900}
          spaceBetween={20}
          slidesPerView="auto"
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          className="mt-[60px] md:mt-[100px]"
        >
          {slides.map((image, index) => (
            <SwiperSlide key={`${image.src}-${index}`} className="!w-[80vw] md:!w-[44vw]">
              <Slide image={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="mt-[60px] flex gap-5 overflow-hidden md:mt-[100px]">
          {slides.map((image, index) => (
            <div key={`${image.src}-${index}`} className="w-[80vw] shrink-0 md:w-[44vw]">
              <Slide image={image} />
            </div>
          ))}
        </div>
      )}

      <p className="text-copy md:mx-auto mt-[60px] md:max-w-[453px] px-5 md:text-center text-[#555] md:text-grey">{views.text}</p>
    </section>
  );
}

function Slide({ image }: { image: Picture }) {
  return (
    <>
      <div className="relative aspect-[670/450] overflow-hidden rounded-[5px]">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 44vw, 80vw" className="object-cover" />
      </div>
      <p className="text-small mt-3 text-grey">{image.alt}</p>
    </>
  );
}
