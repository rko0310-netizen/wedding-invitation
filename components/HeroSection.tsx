"use client";

import React, { useEffect, useState } from "react";

export default function HeroSection() {
  const weddingDate = new Date("2026-09-12T13:30:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-secondary">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="w-full h-full bg-gradient-to-b from-accent/20 to-secondary flex items-center justify-center text-primary/10 text-9xl font-serif italic select-none">
          Wedding
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="space-y-2">
          <p className="text-primary tracking-[0.3em] uppercase text-sm mb-4">Save the Date</p>
          <h1 className="text-4xl md:text-5xl font-light text-foreground">
            정훈 <span className="text-primary px-2">&</span> 희원
          </h1>
          <p className="text-lg text-primary/80 mt-2 font-light">
            2026. 09. 12. SAT PM 01:30
          </p>
        </div>

        <div className="pt-8 flex space-x-4 md:space-x-8 text-primary">
          <div className="flex flex-col">
            <span className="text-2xl font-light">{timeLeft.days}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-60">Days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-light">{timeLeft.hours}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-60">Hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-light">{timeLeft.minutes}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-60">Mins</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-light">{timeLeft.seconds}</span>
            <span className="text-[10px] uppercase tracking-widest opacity-60">Secs</span>
          </div>
        </div>

        <div className="pt-12 animate-bounce">
          <svg className="w-6 h-6 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
