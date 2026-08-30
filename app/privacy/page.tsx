export const metadata = {
  title: "개인정보처리방침",
};

export default function Privacy() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-[500px] mx-auto bg-background shadow-xl min-h-screen px-8 py-20 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">Privacy</h1>
          <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
          <p className="text-sm text-primary/60 break-keep">개인정보처리방침</p>
        </div>

        <div className="space-y-6 text-[13px] leading-relaxed text-primary/70 break-keep">
          <p>
            본 청첩장은 정훈 &amp; 희원의 결혼식 안내를 위한 개인적인 페이지이며, 상업적 목적으로
            운영되지 않습니다.
          </p>

          <section className="space-y-2">
            <h2 className="text-primary font-medium">1. 수집하는 항목</h2>
            <p>
              하객 스냅 기능을 이용해 사진을 등록하시는 경우에 한하여, 입력하신 성함과 업로드하신
              사진이 저장됩니다. 그 밖의 개인정보는 수집하지 않으며, 별도의 회원가입 절차가 없습니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-primary font-medium">2. 이용 목적</h2>
            <p>
              수집된 사진과 성함은 청첩장 내 갤러리에 함께 전시하고 결혼식 추억을 보관하는 목적으로만
              이용합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-primary font-medium">3. 보관 및 파기</h2>
            <p>
              등록된 사진은 혼주의 Google Drive에 보관됩니다. 삭제를 원하시면 아래 연락처로 요청해
              주시기 바라며, 확인 후 지체 없이 파기합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-primary font-medium">4. 제3자 제공</h2>
            <p>
              수집된 정보는 어떠한 경우에도 제3자에게 제공하거나 판매하지 않습니다. 사진 보관을 위해
              Google Drive 서비스를 이용합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-primary font-medium">5. 문의</h2>
            <p>heew0420@gmail.com</p>
          </section>
        </div>

        <div className="pt-8 text-center">
          <a href="/" className="text-[11px] tracking-widest text-accent hover:underline">
            청첩장으로 돌아가기
          </a>
        </div>
      </div>
    </main>
  );
}
