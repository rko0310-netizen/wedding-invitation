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
          오랜 시간 마주보며 다져온 사랑을<br />
          이제 함께 한 곳을 바라보며 걸어가고자 합니다.<br /><br />
          저희 두 사람이 사랑의 이름으로<br />
          지키고 가꾸어 나갈 약속의 자리에<br />
          함께하시어 축복해 주시면 감사하겠습니다.
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
          <p className="text-sm text-primary/60"> 이금자 의 장녀 윤희원</p>
        </div>
      </div>
    </section>
  );
}
