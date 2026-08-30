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
  const [uploadProgress, setUploadProgress] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const weddingImages = [
    "/gallery/0.jpg",
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/6.jpg",
    "/gallery/7.jpg",
    "/gallery/8.jpg",
    "/gallery/9.jpg",
    "/gallery/10.jpg",
    "/gallery/11.jpg",
    "/gallery/12.jpg",
    "/gallery/13.jpg",
    "/gallery/14.jpg",
    "/gallery/15.jpg",
    "/gallery/16.jpg",
    "/gallery/17.jpg",
    "/gallery/18.jpg",
    "/gallery/19.jpg",
    "/gallery/20.jpg",
    "/gallery/21.jpg",
    "/gallery/22.jpg",
  ];

  const currentImages = activeTab === "wedding" 
    ? weddingImages 
    : guestPhotos.map(p => p.image_url);

  // 하객 사진 불러오기
  const fetchGuestPhotos = async () => {
    setIsLoadingPhotos(true);
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setGuestPhotos(data);
      }
    } catch (err) {
      console.error("Failed to fetch photos", err);
    } finally {
      setIsLoadingPhotos(false);
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

  // 사진 1장을 구글 드라이브로 직접 올린다(서버를 거치지 않아 원본 그대로 저장된다)
  const uploadOne = async (
    file: File,
    uploaderName: string,
    onProgress: (ratio: number) => void
  ) => {
    const prepared = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        uploader_name: uploaderName,
      }),
    });
    if (!prepared.ok) throw new Error("prepare failed");
    const { uploadUrl } = await prepared.json();

    const { id } = await new Promise<{ id: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) onProgress(ev.loaded / ev.total);
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve(JSON.parse(xhr.responseText))
          : reject(new Error(`upload failed (${xhr.status})`));
      xhr.onerror = () => reject(new Error("network error"));
      xhr.send(file);
    });

    const published = await fetch("/api/photos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId: id }),
    });
    if (!published.ok) throw new Error("publish failed");
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = new FormData(e.currentTarget);
    const files = (e.currentTarget.querySelector('input[name="file"]') as HTMLInputElement).files;
    const uploaderName = raw.get("uploader_name") as string;

    if (!files || files.length === 0) return;

    const oversized = Array.from(files).find(f => f.size > 20 * 1024 * 1024);
    if (oversized) {
      alert(`"${oversized.name}" 파일이 20MB를 초과합니다.`);
      return;
    }

    setIsUploading(true);
    const failed: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        try {
          await uploadOne(files[i], uploaderName, (ratio) =>
            setUploadProgress(`${i + 1} / ${files.length} 업로드 중... ${Math.round(ratio * 100)}%`)
          );
        } catch {
          failed.push(files[i].name);
        }
      }

      if (failed.length === 0) {
        alert(`${files.length}장이 성공적으로 업로드되었습니다!`);
      } else {
        alert(
          `${files.length - failed.length}장 성공, ${failed.length}장 실패했습니다.\n\n` +
          `실패한 사진: ${failed.join(", ")}\n\n` +
          `JPG, PNG, WEBP 형식만 올릴 수 있습니다. 아이폰 사진(HEIC)이라면 설정 > 카메라 > 포맷 을 "높은 호환성"으로 바꾸신 뒤 다시 촬영해 주세요.`
        );
      }
      setShowUploadModal(false);
      setActiveTab("guests");
      fetchGuestPhotos();
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  return (
    <section className="py-20 px-4 space-y-8 bg-background">
      <div className="text-center space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Gallery</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
        
        {/* 탭 네비게이션 */}
        <div className="flex items-center justify-center gap-8 text-sm pt-4">
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

        {/* 사진 올리기 버튼 — 항상 표시 */}
        <div className="pt-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2 border border-accent text-accent text-[11px] tracking-widest rounded-full hover:bg-accent hover:text-white transition-colors"
          >
            추억을 남겨주세요.
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
            {isLoadingPhotos ? (
              <div className="col-span-3 py-20 text-center text-primary/40 text-xs">
                불러오는 중...
              </div>
            ) : guestPhotos.length > 0 ? (
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
        </div>
      )}

      {/* 사진 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white w-full max-w-sm rounded-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-primary">하객 스냅 올리기</h3>
              <p className="text-[10px] text-primary/60">소중한 추억을 직접 남겨주세요.</p>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-primary/40 ml-1">사진 선택</label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  multiple
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
                  {isUploading ? (uploadProgress || "업로드 중...") : "등록하기"}
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


