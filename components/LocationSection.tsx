"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function LocationSection() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=f00df4c56eb295d97718b9b3e1621075&autoload=false`;
    script.async = true;

    const initMap = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(35.548608, 129.139212),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(35.548608, 129.139212);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        // 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, []);

  const openKakaoMap = () => {
    window.open("https://map.kakao.com/link/map/더엠컨벤션,35.548608,129.139212", "_blank");
  };

  const openNaverMap = () => {
    window.open("https://map.naver.com/v5/search/더엠컨벤션?c=129.139212,35.548608,15,0,0,0,dh", "_blank");
  };

  const openTMap = () => {
    window.open("https://apis.openapi.sk.com/tmap/app/routes?name=더엠컨벤션&lat=35.548608&lon=129.139212", "_blank");
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
      <div 
        ref={mapRef}
        className="w-full aspect-video bg-secondary/30 rounded-lg border border-accent/10"
      >
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
