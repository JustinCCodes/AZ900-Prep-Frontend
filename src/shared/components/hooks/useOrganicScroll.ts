"use client";

export function useOrganicScroll() {
  const organicScroll = (targetY: number, duration: number = 800) => {
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      window.scrollTo(0, startY + difference * easedProgress);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return { organicScroll };
}
