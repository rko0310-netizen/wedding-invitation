import HeroSection from "@/components/HeroSection";
import GreetingSection from "@/components/GreetingSection";
import GallerySection from "@/components/GallerySection";
import LocationSection from "@/components/LocationSection";
import AccountSection from "@/components/AccountSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full max-w-[500px] mx-auto bg-background shadow-xl min-h-screen">
        <HeroSection />
        <GreetingSection />
        <GallerySection />
        <LocationSection />
        <AccountSection />
        
        <footer className="py-20 px-8 text-center bg-secondary/20">
          <p className="text-[10px] text-primary/40 uppercase tracking-widest">
            © 2026 Jeonghun & Heewon Wedding
          </p>
        </footer>
      </div>
    </main>
  );
}
