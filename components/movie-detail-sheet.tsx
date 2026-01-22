"use client";

import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, ExternalLink, Star } from "lucide-react";
import { getMovieDetails, getImagePath } from "@/lib/tmdb";
import Link from "next/link";
import Image from "next/image";

interface MovieDetailSheetProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  hrefBase?: string;
}

export function MovieDetailSheet({
  movieId,
  isOpen,
  onClose,
  hrefBase = "movie",
}: MovieDetailSheetProps) {
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen && movieId) {
      setLoading(true);
      setMovieDetails(null);

      getMovieDetails(movieId.toString())
        .then((data) => {
          setMovieDetails(data);
        })
        .catch((error) => {
          console.error("Failed to fetch movie details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, movieId]);

  const title = movieDetails?.title || movieDetails?.name || "영화 정보";
  const overview = movieDetails?.overview || "줄거리 정보가 없습니다.";
  const voteAverage = movieDetails?.vote_average?.toFixed(1) || "N/A";
  const releaseDate = movieDetails?.release_date?.slice(0, 4) || 
                      movieDetails?.first_air_date?.slice(0, 4) || "";
  const runtime = movieDetails?.runtime 
    ? `${movieDetails.runtime}분` 
    : movieDetails?.episode_run_time?.[0]
    ? `${movieDetails.episode_run_time[0]}분`
    : "";
  const genres = movieDetails?.genres?.slice(0, 3).map((g: any) => g.name).join(", ") || "";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"} 
        className={`${isMobile ? 'h-[85vh] rounded-t-2xl' : 'w-full sm:max-w-lg'} overflow-y-auto`}
      >
        {loading || !movieDetails ? (
          // 로딩 스켈레톤
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold pr-8">{title}</SheetTitle>
              {(releaseDate || runtime || voteAverage !== "N/A") && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {releaseDate && <span>{releaseDate}</span>}
                  {runtime && <span>{runtime}</span>}
                  {voteAverage !== "N/A" && (
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      {voteAverage}
                    </span>
                  )}
                </div>
              )}
            </SheetHeader>

            {/* 포스터 이미지 */}
            {movieDetails.backdrop_path && (
              <div className="relative w-full h-64 rounded-md overflow-hidden">
                <Image
                  src={getImagePath(movieDetails.backdrop_path)}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}

            {/* 장르 */}
            {genres && (
              <div className="flex flex-wrap gap-2">
                {movieDetails.genres.slice(0, 3).map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full bg-muted text-xs"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* 줄거리 */}
            <SheetDescription className="text-foreground leading-relaxed">
              {overview}
            </SheetDescription>

            {/* 버튼들 */}
            <SheetFooter className="gap-2 sm:gap-2">
              <Button 
                variant="default" 
                className="flex-1 gap-2"
                onClick={() => {
                  // 예고편 재생 로직 (추후 구현)
                  alert("예고편 재생 기능은 준비 중입니다.");
                }}
              >
                <Play className="h-4 w-4 fill-current" />
                예고편
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                asChild
              >
                <Link href={`/${hrefBase}-detail?id=${movieId}`} onClick={onClose}>
                  <ExternalLink className="h-4 w-4" />
                  상세 페이지
                </Link>
              </Button>
            </SheetFooter>

            {/* 추가 정보 */}
            {(movieDetails.production_companies?.length > 0 || movieDetails.spoken_languages?.length > 0) && (
              <div className="space-y-2 text-sm border-t pt-4">
                {movieDetails.production_companies?.length > 0 && (
                  <div>
                    <span className="font-semibold text-muted-foreground">제작사: </span>
                    <span className="text-foreground">
                      {movieDetails.production_companies
                        .slice(0, 2)
                        .map((c: any) => c.name)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {movieDetails.spoken_languages?.length > 0 && (
                  <div>
                    <span className="font-semibold text-muted-foreground">언어: </span>
                    <span className="text-foreground">
                      {movieDetails.spoken_languages
                        .map((l: any) => l.english_name)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
