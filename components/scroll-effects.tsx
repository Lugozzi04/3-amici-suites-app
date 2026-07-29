"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ScrollEffects() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const staggerGroups = Array.from(document.querySelectorAll<HTMLElement>("[data-stagger]"));

    revealItems.forEach((item) => {
      item.dataset.reveal = item.dataset.reveal || "true";
    });

    staggerGroups.forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (child instanceof HTMLElement) {
          child.style.setProperty("--reveal-delay", `${index * 110}ms`);
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, value)));
      document.documentElement.style.setProperty("--scroll-progress", `${value}`);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[59]">
      <div className="absolute left-0 top-0 h-1 w-full bg-transparent">
        <div
          className="h-full origin-left bg-gradient-to-r from-earth via-olive to-sand transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <div className="absolute left-[8vw] top-[18vh] h-72 w-72 rounded-full bg-olive/10 blur-3xl parallax-soft" />
      <div className="absolute right-[6vw] top-[28vh] h-96 w-96 rounded-full bg-earth/10 blur-3xl parallax-medium" />
      <div className="absolute bottom-[12vh] left-[52vw] h-56 w-56 rounded-full bg-sand/40 blur-3xl parallax-strong" />
    </div>
  );
}
