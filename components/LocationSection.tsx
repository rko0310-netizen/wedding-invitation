import React from "react";

export default function LocationSection() {
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

      {/* Map Placeholder */}
      <div className="w-full aspect-video bg-secondary/30 rounded-lg flex items-center justify-center border border-accent/10">
        <div className="text-center">
          <p className="text-primary/60 text-sm mb-2">지도가 표시될 영역입니다.</p>
          <p className="text-[10px] text-primary/40">(Kakao/Naver Map API 연동 필요)</p>
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        <button className="px-4 py-2 border border-accent/20 rounded-full text-xs text-primary/80 hover:bg-secondary transition-colors">
          카카오맵
        </button>
        <button className="px-4 py-2 border border-accent/20 rounded-full text-xs text-primary/80 hover:bg-secondary transition-colors">
          네이버지도
        </button>
        <button className="px-4 py-2 border border-accent/20 rounded-full text-xs text-primary/80 hover:bg-secondary transition-colors">
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
