"use client";

import Image from "next/image";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
  title: string;
  imageUrl: string;
  year?: string;
  duration?: string;
  rating?: string;
}

export function MovieCard({
  title,
  imageUrl,
  year = "2024",
  duration = "2시간 15분",
  rating = "15+",
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex-shrink-0 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card */}
      <div
        className={`relative aspect-[2/3] w-36 overflow-hidden rounded-sm transition-all duration-300 ease-out md:w-44 lg:w-48 ${
          isHovered ? "scale-110 z-50 shadow-2xl" : "scale-100"
        }`}
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 192px"
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Expanded Info Panel */}
      <div
        className={`absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 rounded-b-md bg-card shadow-2xl transition-all duration-300 md:w-56 lg:w-60 ${
          isHovered
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="space-y-3 p-3">
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-110">
              <Play className="h-4 w-4 fill-current" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/50 text-foreground transition-colors hover:border-foreground">
              <Plus className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/50 text-foreground transition-colors hover:border-foreground">
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/50 text-foreground transition-colors hover:border-foreground">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-green-500">98% 일치</span>
            <span className="rounded border border-muted-foreground/50 px-1 py-0.5 text-muted-foreground">
              {rating}
            </span>
            <span className="text-muted-foreground">{duration}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            <span>스릴러</span>
            <span>•</span>
            <span>미스터리</span>
            <span>•</span>
            <span>범죄</span>
          </div>
        </div>
      </div>
    </div>
  );
}
