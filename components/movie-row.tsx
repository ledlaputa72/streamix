"use client";

import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { getImagePath } from "@/lib/tmdb";
import Link from "next/link";

interface MovieRowProps {
  title: string;
  movies: any[];
  hrefBase?: string;
}

export function MovieRow({ title, movies, hrefBase = "movie" }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 200 + 16; // 카드 너비 + gap
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 마우스 휠 스크롤 처리 (세로 휠을 가로 스크롤로 변환)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Shift 키를 누르면 가로 스크롤, 아니면 세로 휠을 가로 스크롤로 변환
      const deltaX = e.shiftKey ? e.deltaY : e.deltaX || e.deltaY;
      
      if (Math.abs(deltaX) > 0) {
        e.preventDefault();
        container.scrollBy({
          left: deltaX,
          behavior: "smooth",
        });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // 초기 화살표 상태 확인
  useEffect(() => {
    handleScroll();
  }, [movies]);

  return (
    <section className="relative py-4 md:py-6">
      {/* Section Title */}
      <h2 className="mb-3 px-6 text-2xl font-bold text-white md:px-12 lg:px-16">
        {title}
      </h2>

      {/* Scroll Container Wrapper */}
      <div className="group/row relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 z-40 flex h-full w-12 items-center justify-center bg-gradient-to-r from-black/80 to-transparent transition-opacity md:w-16 ${
            showLeftArrow
              ? "opacity-0 group-hover/row:opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 text-white drop-shadow-lg" />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-6 pb-4 md:px-12 lg:px-16"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {movies.map((movie) => (
            // TMDB Movie vs TV: title 대신 name을 쓸 수 있음
            // (TV 데이터의 경우 movie.name)
            (() => {
              const displayTitle: string = movie?.title ?? movie?.name ?? "";
              const posterPath: string | null | undefined = movie?.poster_path;

              return (
            <Link
              key={movie.id}
              href={`/${hrefBase}/${movie.id}`}
              className="min-w-[200px] flex-shrink-0 transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer group relative"
            >
              <div className="relative overflow-hidden rounded-md">
                {posterPath ? (
                  <>
                    <img
                      src={getImagePath(posterPath)}
                      alt={displayTitle}
                      className="object-cover w-full h-[300px] transition-opacity duration-300"
                    />
                    {/* 어두운 오버레이와 재생 아이콘 */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md bg-gray-800 w-full h-[300px] flex items-center justify-center">
                    <span className="text-gray-500 text-sm">이미지 없음</span>
                  </div>
                )}
              </div>
              {displayTitle && (
                <p className="mt-2 text-sm text-gray-300 line-clamp-1 group-hover:text-white transition-colors">
                  {displayTitle}
                </p>
              )}
            </Link>
              );
            })()
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 z-40 flex h-full w-12 items-center justify-center bg-gradient-to-l from-black/80 to-transparent transition-opacity md:w-16 ${
            showRightArrow
              ? "opacity-0 group-hover/row:opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 text-white drop-shadow-lg" />
        </button>
      </div>
    </section>
  );
}
