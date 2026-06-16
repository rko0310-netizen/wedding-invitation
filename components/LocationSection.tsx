"use client";

import React from "react";
import Image from "next/image";

export default function LocationSection() {
  const lat = 35.548608;
  const lng = 129.139212;
  const name = "더엠컨벤션";
  const address = "울산광역시 울주군 삼남읍 도호길 31 9층";

  const openMap = (service: string) => {
    if (service === "kakao") {
      window.open(`https://map.kakao.com/link/map/${name},${lat},${lng}`, "_blank");
    } else if (service === "naver") {
      window.open(`https://map.naver.com/v5/search/${encodeURIComponent(name)}?c=${lng},${lat},15,0,0,0,dh`, "_blank");
    } else if (service === "tmap") {
      window.open(`https://apis.openapi.sk.com/tmap/app/routes?name=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}`, "_blank");
    }
  };

  return (
    <section className="py-20 px-8 text-center space-y-12 bg-white font-serif">
      <div className="space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Location</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">{name}</h3>
        <p className="text-foreground/70 font-light text-sm">{address}</p>
      </div>

      {/* 지도 이미지 영역 - 직접 캡처한 로컬 이미지 사용 */}
      <div
        className="w-full aspect-video rounded-lg border border-accent/10 overflow-hidden shadow-md cursor-pointer relative group bg-secondary/5"
        onClick={() => openMap("naver")}
      >
        <Image
          src="/map.png"
          alt="더엠컨벤션 지도"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 500px) 100vw, 500px"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
        <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-full shadow-sm text-[10px] text-primary/70 font-sans backdrop-blur-sm z-30">
          지도 확대보기
        </div>
      </div>

      <div className="flex justify-center space-x-3">
        <button onClick={() => openMap("naver")} className="flex-1 max-w-[100px] py-2.5 border border-accent/20 rounded-lg text-[11px] text-primary/80 font-sans">네이버지도</button>
        <button onClick={() => openMap("kakao")} className="flex-1 max-w-[100px] py-2.5 border border-accent/20 rounded-lg text-[11px] text-primary/80 font-sans">카카오맵</button>
      </div>

      <div className="text-left space-y-6 pt-8 border-t border-accent/5">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary flex items-center">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
            오시는 길
          </h4>
          <p className="text-sm text-foreground/70 font-light">울산역(통도사) 3번 출구 도보 3분</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary flex items-center">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
            주차 안내
          </h4>
          <p className="text-sm text-foreground/70 font-light">건물 주차장은 지하 2층부터 지상 9층까지 이용 가능하오니,<br />혼잡 시 지상 주차장을 이용 부탁드립니다.</p>
        </div>
      </div>
    </section>
  );
}
