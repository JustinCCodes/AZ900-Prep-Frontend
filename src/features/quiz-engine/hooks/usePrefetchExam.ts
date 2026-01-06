"use client";

import { useRouter } from "next/navigation";
import { getStandardExam } from "../data";

export function usePrefetchExam() {
  const router = useRouter();

  const handleHover = async () => {
    console.log(
      "[Rank: Principal] User intent detected. Warming up Exam Cache..."
    );

    router.prefetch("/exam/training");

    await getStandardExam().catch(() => {});
  };

  return { handleHover };
}
