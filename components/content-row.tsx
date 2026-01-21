"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./movie-card";
import { useRef, useState } from "react";

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  year?: string;
  duration?: string;
  rating?: string;
}

interface ContentRowProps {
  title: string;
  movies: Movie[];
}

export function ContentRow({ title, movies }: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-4 md:py-6">
      {/* Section Title */}
      <h2 className="mb-3 px-6 text-lg font-semibold text-foreground md:px-12 md:text-xl lg:px-16 lg:text-2xl">
        {title}
      </h2>

      {/* Scroll Container Wrapper */}
      <div className="group/row relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 z-40 flex h-full w-12 items-center justify-center bg-gradient-to-r from-background to-transparent transition-opacity md:w-16 ${
            showLeftArrow
              ? "opacity-0 group-hover/row:opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 text-foreground" />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex gap-2 overflow-x-auto px-6 pb-16 md:gap-3 md:px-12 lg:px-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              imageUrl={movie.imageUrl}
              year={movie.year}
              duration={movie.duration}
              rating={movie.rating}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 z-40 flex h-full w-12 items-center justify-center bg-gradient-to-l from-background to-transparent transition-opacity md:w-16 ${
            showRightArrow
              ? "opacity-0 group-hover/row:opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 text-foreground" />
        </button>
      </div>
    </section>
  );
}
