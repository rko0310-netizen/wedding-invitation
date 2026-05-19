"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface GuestPhoto {
  id: string;
  image_url: string;
  uploader_name: string;
  created_at: string;
}

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState<"wedding" | "guests">("wedding");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [guestPhotos, setGuestPhotos] = useState<GuestPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const weddingImages = [
    "/gallery/KakaoTalk_20260509_132113209.jpg",
    "/gallery/KakaoTalk_20260509_132113209_01.jpg",
    "/gallery/KakaoTalk_20260509_132113209_02.jpg",
    "/gallery/KakaoTalk_20260509_132113209_03.jpg",
    "/gallery/KakaoTalk_20260509_132113209_04.jpg",
  ];

  const currentImages = activeTab === "wedding" 
    ? weddingImages 
    : guestPhotos.map(p => p.image_url);

  // 하객 사진 불러오기
  const fetchGuestPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setGuestPhotos(data);
      }
    } catch (err) {
      console.error("Failed to fetch photos", err);
    }
  };

  useEffect(() => {
    if (activeTab === "guests") {
      fetchGuestPhotos();
    }
  }, [activeTab]);

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
      const nextIndex = ((selectedIndex ?? 0) + 1) % currentImages.length;
      const targetElement = container.children[nextIndex] as HTMLElement;
      container.scrollTo({ left: targetElement.offsetLeft, behavior: "smooth" });
      setSelectedIndex(nextIndex);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollRef.current) {
      const container = scrollRef.current;
      const prevIndex = ((selectedIndex ?? 0) - 1 + currentImages.length) % currentImages.length;
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

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setIsUploading(true);
    try {
      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("사진이 성공적으로 업로드되었습니다!");
        setShowUploadModal(false);
        fetchGuestPhotos();
      } else {
        alert(data.error || "업로드에 실패했습니다.");
      }
    } catch (err) {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-20 px-4 space-y-8 bg-background">
      <div className="text-center space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Gallery</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
        
        {/* 탭 네비게이션 */}
        <div className="flex justify-center gap-8 text-sm pt-4">
          <button 
            onClick={() => setActiveTab("wedding")}
            className={`pb-2 transition-all ${activeTab === "wedding" ? "text-accent border-b border-accent" : "text-primary/40"}`}
          >
            우리의 사진
          </button>
          <button 
            onClick={() => setActiveTab("guests")}
            className={`pb-2 transition-all ${activeTab === "guests" ? "text-accent border-b border-accent" : "text-primary/40"}`}
          >
            하객의 시선
          </button>
        </div>
      </div>

      {activeTab === "wedding" ? (
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {weddingImages.map((src, index) => {
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {guestPhotos.length > 0 ? (
              guestPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className="relative aspect-square overflow-hidden bg-secondary/30 cursor-pointer group"
                  onClick={() => setSelectedIndex(index)}
                >
                  <Image
                    src={photo.image_url}
                    alt={`Guest Snap by ${photo.uploader_name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 500px) 33vw, 165px"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] p-1 truncate">
                    {photo.uploader_name}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center text-primary/40 text-xs italic">
                아직 등록된 사진이 없습니다. 첫 번째 사진을 올려보세요!
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-accent text-white text-xs tracking-widest rounded-full hover:bg-accent/80 transition-colors shadow-lg"
            >
              사진 올리기
            </button>
          </div>
        </div>
      )}

      {/* 사진 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-primary">하객 스냅 올리기</h3>
              <p className="text-[10px] text-primary/60">오늘의 소중한 순간을 함께 공유해주세요.</p>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-primary/40 ml-1">사진 선택</label>
                <input 
                  type="file" 
                  name="file" 
                  accept="image/*" 
                  required 
                  className="w-full text-xs border border-secondary p-2 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-primary/40 ml-1">성함</label>
                <input 
                  type="text" 
                  name="uploader_name" 
                  placeholder="하객 성함"
                  required 
                  className="w-full text-xs border border-secondary p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-primary/40 ml-1">업로드 암호</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="신랑 또는 신부 이름"
                  required 
                  className="w-full text-xs border border-secondary p-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              
              <div className="pt-4 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-3 text-xs text-primary/60 hover:bg-secondary/20 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3 bg-accent text-white text-xs rounded-lg hover:bg-accent/90 disabled:bg-accent/50 transition-colors"
                >
                  {isUploading ? "업로드 중..." : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 사진 확대 모달 */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={() => setSelectedIndex(null)}
        >
          <button className="hidden md:block absolute left-8 z-[110] text-white/50 hover:text-white text-4xl" onClick={handlePrev}>&#10094;</button>
          <div ref={scrollRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" onScroll={handleScroll} onClick={(e) => e.stopPropagation()}>
            {currentImages.map((src, index) => (
              <div key={index} className="min-w-full h-full flex items-center justify-center snap-center p-4" onClick={() => setSelectedIndex(null)}>
                <div className="relative w-full max-w-4xl h-[80vh]">
                  <Image src={src} alt="Gallery image" fill className="object-contain" quality={100} priority={index === selectedIndex} />
                </div>
              </div>
            ))}
          </div>
          <button className="hidden md:block absolute right-8 z-[110] text-white/50 hover:text-white text-4xl" onClick={handleNext}>&#10095;</button>
          <button className="absolute top-8 right-8 z-[110] text-white/50 hover:text-white text-3xl" onClick={() => setSelectedIndex(null)}>&times;</button>
        </div>
      )}
    </section>
  );
}


