"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    "/gallery/KakaoTalk_20260509_132113209.jpg",
    "/gallery/KakaoTalk_20260509_132113209_01.jpg",
    "/gallery/KakaoTalk_20260509_132113209_02.jpg",
    "/gallery/KakaoTalk_20260509_132113209_03.jpg",
    "/gallery/KakaoTalk_20260509_132113209_04.jpg",
  ];

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
          // 인스타그램처럼 첫 번째 사진이나 특정 사진을 크게 배치하여 리듬감을 줌
          const isLarge = index === 0;
          return (
            <div 
              key={index} 
              className={`relative overflow-hidden bg-secondary/30 cursor-pointer group ${
                isLarge ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
              onClick={() => setSelectedImage(src)}
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

      {/* 사진 확대 모달 (라이트박스) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-lg aspect-[3/4] max-h-[80vh]">
            <Image
              src={selectedImage}
              alt="Expanded view"
              fill
              className="object-contain"
              quality={100}
            />
          </div>
          <button 
            className="absolute top-8 right-8 text-white/70 hover:text-white text-3xl font-light p-2"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </section>
  );
}
