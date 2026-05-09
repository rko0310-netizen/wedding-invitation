"use client";

import { useEffect } from "react";

export default function SecurityWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 마우스 우클릭 방지
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 이미지 드래그 및 복사 방지
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 개발자 도구 단축키 차단 (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U 등)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}
