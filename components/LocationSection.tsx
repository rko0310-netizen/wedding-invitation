"use client";

import React from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

export default function LocationSection() {
  const position = { lat: 35.548608, lng: 129.139212 };
  
  // 지도를 불러오는 로더입니다.
  const { loading, error } = useKakaoLoader({
    appkey: "f00df4c56eb295d97718b9b3e1621075", // 사용자님의 자바스크립트 키
  });

  const openKakaoMap = () => {
    window.open(`https://map.kakao.com/link/map/더엠컨벤션,${position.lat},${position.lng}`, "_blank");
  };

  const openNaverMap = () => {
    window.open(`https://map.naver.com/v5/search/더엠컨벤션?c=${position.lng},${position.lat},15,0,0,0,dh`, "_blank");
  };

  const openTMap = () => {
    window.open(`https://apis.openapi.sk.com/tmap/app/routes?name=더엠컨벤션&lat=${position.lat}&lon=${position.lng}`, "_blank");
  };

  return (
    <section className="py-20 px-8 text-center space-y-12 bg-white">
      <div className="space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Location</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium text-primary">더엠컨벤션</h3>
        <p className="text-foreground/70 font-light">울산광역시 울주군 삼남읍 도호길 31 9층</p>
        <p className="text-foreground/70 font-light">0507-1469-5501</p>
      </div>

      {/* Map Container */}
      <div className="w-full aspect-video rounded-lg border border-accent/10 overflow-hidden shadow-sm flex items-center justify-center bg-secondary/10">
        {loading ? (
          <p className="text-sm text-primary/40 animate-pulse">지도를 불러오는 중입니다...</p>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-sm text-red-400">지도를 불러오지 못했습니다.</p>
            <p className="text-[10px] text-primary/40 mt-1">카카오 개발자 센터의 '플랫폼' 설정을 확인해주세요.</p>
          </div>
        ) : (
          <Map
            center={position}
            style={{ width: "100%", height: "100%" }}
            level={3}
          >
            <MapMarker position={position} />
          </Map>
        )}
      </div>

      <div className="flex justify-center space-x-2">
        <button 
          onClick={openKakaoMap}
          className="px-4 py-2 border border-accent/20 rounded-full text-xs text-primary/80 hover:bg-secondary transition-colors"
        >
          카카오맵
        </button>
        <button 
          onClick={openNaverMap}
          className="px-4 py-2 border border-accent/20 rounded-full text-xs text-primary/80 hover:bg-secondary transition-colors"
        >
          네이버지도
        </button>
        <button 
          onClick={openTMap}
          className="px-4 py-2 border border-accent/20 rounded-full text-xs text-primary/80 hover:bg-secondary transition-colors"
        >
          T맵
        </button>
      </div>

      <div className="text-left space-y-8 pt-8">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-primary flex items-center">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
            KTX / SRT
          </h4>
          <p className="text-sm text-foreground/70 font-light leading-relaxed">
            울산역(통도사) 하차<br />
            1번 출구로 나와 도보 약 5분 (금아드림스퀘어 9층)
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-primary flex items-center">
            <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
            버스
          </h4>
          <p className="text-sm text-foreground/70 font-light leading-relaxed">
            '울산역' 정류장 하차 후 도보 5분<br />
            리무진: 5001, 5002, 5003, 5004, 5005<br />
            일반: 304, 327, 337, 348, 807
          </p>
        </div>
      </div>
    </section>
  );
}
