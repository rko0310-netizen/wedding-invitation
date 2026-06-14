import React from "react";

export default function GreetingSection() {
  return (
    <section className="py-20 px-8 text-center space-y-12 bg-white">
      <div className="space-y-6">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Invitation</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
      </div>
      
      <div className="space-y-8">
        <p className="leading-loose text-foreground/80 font-light break-keep">
          웃음으로 시작한 우정이<br />
          서서히 따스함을 품고.<br />
          서로의 하루에 스며들었습니다。<br /><br />
          그 마음이 사랑이 되었고、<br />
          이제는 부부로서 같은 길을 걸으려 합니다.
        </p>

        <div className="pt-8 space-y-4">
          <div className="flex justify-center items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-primary/60 mb-1">신랑</p>
              <p className="text-lg">이정훈</p>
            </div>
            <div className="w-[1px] h-8 bg-accent/20"></div>
            <div className="text-left">
              <p className="text-sm text-primary/60 mb-1">신부</p>
              <p className="text-lg">윤희원</p>
            </div>
          </div>
          <p className="text-sm text-primary/60 pt-4">이문규 · 노경옥 의 장남 이정훈</p>
          <p className="text-sm text-primary/60"> 윤영식 · 이금자 의 장녀 윤희원</p>
        </div>
      </div>
    </section>
  );
}
