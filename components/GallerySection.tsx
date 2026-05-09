"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = [
    "/gallery/KakaoTalk_20260509_132113209.jpg",
    "/gallery/KakaoTalk_20260509_132113209_01.jpg",
    "/gallery/KakaoTalk_20260509_132113209_02.jpg",
    "/gallery/KakaoTalk_20260509_132113209_03.jpg",
    "/gallery/KakaoTalk_20260509_132113209_04.jpg",
  ];

  const isInitialOpen = useRef(true);

  // 모달이 열릴 때 선택된 이미지로 스크롤
  useEffect(() => {
    if (selectedIndex === null) {
      isInitialOpen.current = true;
      return;
    }

    if (isInitialOpen.current && scrollRef.current) {
      const container = scrollRef.current;
      const targetElement = container.children[selectedIndex] as HTMLElement;
      if (targetElement) {
        container.scrollTo({
          left: targetElement.offsetLeft,
          behavior: "instant",
        });
        isInitialOpen.current = false;
      }
    }
  }, [selectedIndex]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollRef.current) {
      const container = scrollRef.current;
      const nextIndex = ((selectedIndex ?? 0) + 1) % images.length;
      const targetElement = container.children[nextIndex] as HTMLElement;
      container.scrollTo({ left: targetElement.offsetLeft, behavior: "smooth" });
      setSelectedIndex(nextIndex);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollRef.current) {
      const container = scrollRef.current;
      const prevIndex = ((selectedIndex ?? 0) - 1 + images.length) % images.length;
      const targetElement = container.children[prevIndex] as HTMLElement;
      container.scrollTo({ left: targetElement.offsetLeft, behavior: "smooth" });
      setSelectedIndex(prevIndex);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const index = Math.round(container.scrollLeft / container.clientWidth);
      if (index !== selectedIndex) {
        setSelectedIndex(index);
      }
    }
  };

  return (
    <section className="py-20 px-4 space-y-12 bg-background">
      <div className="text-center space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Gallery</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
        <p className="text-xs text-primary/60 font-serif">우리의 소중한 순간들을 담았습니다.</p>
      </div>

      {/* 인스타그램 스타일 그리드 레이아웃 */}
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {images.map((src, index) => {
          const isLarge = index === 0;
          return (
            <div 
              key={index} 
              className={`relative overflow-hidden bg-secondary/30 cursor-pointer group ${
                isLarge ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={src}
                alt={`Wedding Gallery ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes={isLarge ? "(max-width: 500px) 66vw, 330px" : "(max-width: 500px) 33vw, 165px"}
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          );
        })}
      </div>

      {/* 사진 확대 모달 (터치 슬라이드 기능 포함) */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={() => setSelectedIndex(null)}
        >
          {/* 이전 버튼 (PC용) */}
          <button 
            className="hidden md:block absolute left-4 md:left-8 z-[110] text-white/50 hover:text-white text-4xl p-4 transition-colors"
            onClick={handlePrev}
          >
            &#10094;
          </button>

          {/* 슬라이드 컨테이너 */}
          <div 
            ref={scrollRef}
            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            onScroll={handleScroll}
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, index) => (
              <div 
                key={index} 
                className="min-w-full h-full flex items-center justify-center snap-center p-4"
                onClick={() => setSelectedIndex(null)}
              >
                <div className="relative w-full max-w-4xl h-[80vh]">
                  <Image
                    src={src}
                    alt={`Wedding Gallery ${index + 1}`}
                    fill
                    className="object-contain"
                    quality={100}
                    priority={index === selectedIndex}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 다음 버튼 (PC용) */}
          <button 
            className="hidden md:block absolute right-4 md:right-8 z-[110] text-white/50 hover:text-white text-4xl p-4 transition-colors"
            onClick={handleNext}
          >
            &#10095;
          </button>

          {/* 닫기 버튼 */}
          <button 
            className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white text-3xl font-light p-4"
            onClick={() => setSelectedIndex(null)}
          >
            &times;
          </button>

          {/* 페이지 표시 (1 / 5) */}
          <div className="absolute bottom-10 text-white/60 text-xs font-sans tracking-widest pointer-events-none">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}

