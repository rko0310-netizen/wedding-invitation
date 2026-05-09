"use client";

import React, { useState, useRef, useEffect } from "react";

interface AccountProps {
  side: string;
  name: string;
  bank: string;
  account: string;
}

const AccountItem = ({ side, name, bank, account }: AccountProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Copying ${side} account...`);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = account;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="p-4 bg-secondary/30 rounded-lg flex justify-between items-center relative z-10">
      <div className="text-left">
        <p className="text-[10px] text-primary/60 uppercase tracking-tighter mb-1">{side}</p>
        <p className="text-sm font-medium">{bank} {account}</p>
        <p className="text-sm text-foreground/80">{name}</p>
      </div>
      <button
        onClick={handleCopy}
        type="button"
        className={`px-3 py-2 rounded-md text-[11px] transition-all active:scale-95 touch-manipulation relative z-20 ${
          copied ? "bg-primary text-white" : "bg-white border border-accent/20 text-primary"
        }`}
      >
        {copied ? "복사완료" : "복사하기"}
      </button>
    </div>
  );
};

export default function AccountSection() {
  const [openSide, setOpenSide] = useState<string | null>(null);
  const groomRef = useRef<HTMLDivElement>(null);
  const brideRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (side: string) => {
    console.log(`Toggle clicked for: ${side}`);
    setOpenSide(prev => {
      const next = prev === side ? null : side;
      console.log(`Setting openSide to: ${next}`);
      return next;
    });
  };

  useEffect(() => {
    if (openSide) {
      const timer = setTimeout(() => {
        const ref = openSide === "groom" ? groomRef : brideRef;
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [openSide]);

  return (
    <section className="py-20 px-6 text-center space-y-12 bg-background relative z-30">
      <div className="space-y-6 relative z-10">
        <h2 className="text-xl tracking-[0.2em] text-accent uppercase font-medium">마음 전하실 곳</h2>
        <div className="w-8 h-[1px] bg-accent/30 mx-auto"></div>
      </div>

      <div className="space-y-4 max-w-sm mx-auto relative z-40">
        {/* Groom's Side */}
        <div 
          ref={groomRef}
          className="border border-accent/10 rounded-xl overflow-hidden bg-white shadow-sm relative z-10"
        >
          <button
            onClick={() => toggleAccordion("groom")}
            type="button"
            className="w-full px-6 py-5 flex justify-between items-center text-primary font-medium active:bg-secondary/10 transition-colors touch-manipulation relative z-20"
          >
            <span className="tracking-wide">신랑측 계좌번호</span>
            <span className={`transform transition-transform duration-300 pointer-events-none ${openSide === "groom" ? "rotate-180" : ""}`}>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <div 
            className={`transition-all duration-300 ease-in-out ${
              openSide === "groom" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-5 pb-6 space-y-3">
              <AccountItem side="신랑" name="이정훈" bank="신한은행" account="110-123-456789" />
              <AccountItem side="부친" name="이문규" bank="국민은행" account="123-45-678901" />
            </div>
          </div>
        </div>

        {/* Bride's Side */}
        <div 
          ref={brideRef}
          className="border border-accent/10 rounded-xl overflow-hidden bg-white shadow-sm relative z-10"
        >
          <button
            onClick={() => toggleAccordion("bride")}
            type="button"
            className="w-full px-6 py-5 flex justify-between items-center text-primary font-medium active:bg-secondary/10 transition-colors touch-manipulation relative z-20"
          >
            <span className="tracking-wide">신부측 계좌번호</span>
            <span className={`transform transition-transform duration-300 pointer-events-none ${openSide === "bride" ? "rotate-180" : ""}`}>
              <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <div 
            className={`transition-all duration-300 ease-in-out ${
              openSide === "bride" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="px-5 pb-6 space-y-3">
              <AccountItem side="신부" name="윤희원" bank="우리은행" account="1002-123-456789" />
              <AccountItem side="모친" name="이금자" bank="농협" account="302-1234-5678-91" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
