"use client";

import Image from "next/image";
import { Play, Plus, ThumbsUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface SimilarMovie {
  id: number;
  title: string;
  imageUrl: string;
  year: string;
  duration: string;
  rating: string;
  matchPercentage: number;
  description: string;
}

interface SimilarContentProps {
  movies: SimilarMovie[];
  hrefBase?: string; // "movie" 또는 "tv" (기본값: "movie")
}

function SimilarMovieCard({ movie, hrefBase = "movie" }: { movie: SimilarMovie; hrefBase?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/${hrefBase}/${movie.id}`}
      className="group relative overflow-hidden rounded-md bg-card transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={movie.imageUrl || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Play Icon on Hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-background/40 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-foreground bg-background/80">
            <Play className="h-5 w-5 fill-current text-foreground" />
          </div>
        </div>
        {/* Match Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="rounded bg-background/80 px-2 py-1 text-xs font-semibold text-green-500">
            {movie.matchPercentage}% 일치
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 p-4">
        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded border border-muted-foreground/50 px-1.5 py-0.5">
              {movie.rating}
            </span>
            <span>{movie.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-full border border-muted-foreground/50 text-foreground transition-colors hover:border-foreground">
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full border border-muted-foreground/50 text-foreground transition-colors hover:border-foreground">
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-1">{movie.title}</h3>

        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {movie.description}
        </p>
      </div>
    </Link>
  );
}

export function SimilarContent({ movies, hrefBase = "movie" }: SimilarContentProps) {
  return (
    <section className="px-6 py-12 md:px-12 lg:px-16">
      <h2 className="mb-6 text-xl font-semibold text-foreground md:text-2xl">
        비슷한 콘텐츠
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <SimilarMovieCard key={movie.id} movie={movie} hrefBase={hrefBase} />
        ))}
      </div>
    </section>
  );
}
