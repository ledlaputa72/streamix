"use client";

import { Play, Plus, ThumbsUp, Share2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useState } from "react";

interface MovieDetailHeroProps {
  title: string;
  backgroundImage: string;
  year: string;
  rating: string;
  duration: string;
  matchPercentage: number;
  description: string;
  genres: string[];
  cast: string[];
  director: string;
  contentId: string | number;
  contentType: "movie" | "tv";
}

export function MovieDetailHero({
  title,
  backgroundImage,
  year,
  rating,
  duration,
  matchPercentage,
  description,
  genres,
  cast,
  director,
  contentId,
  contentType,
}: MovieDetailHeroProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const { toast } = useToast();

  const handlePlayTrailer = async () => {
    setIsLoadingTrailer(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/${contentType}/${contentId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
      );
      const data = await response.json();
      
      const videos = data.results || [];
      const youtubeVideos = videos.filter((video: any) => video.site === "YouTube");
      const trailer = youtubeVideos.find((video: any) => video.type === "Trailer");
      const teaser = youtubeVideos.find((video: any) => video.type === "Teaser");
      const videoToPlay = trailer || teaser || youtubeVideos[0];

      if (videoToPlay) {
        setTrailerKey(videoToPlay.key);
        setIsTrailerOpen(true);
      } else {
        toast({
          title: "예고편이 준비되지 않았습니다",
          description: "현재 이 콘텐츠의 예고편을 찾을 수 없습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
      toast({
        title: "예고편을 불러올 수 없습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[90vh] flex-col justify-end px-6 pb-16 pt-24 md:px-12 lg:px-16">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-widest text-primary">
              N
            </span>
            <span className="text-sm font-medium tracking-wider text-muted-foreground">
              오리지널 시리즈
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-7xl text-balance">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
            <span className="font-semibold text-green-500">{matchPercentage}% 일치</span>
            <span className="text-muted-foreground">{year}</span>
            <span className="rounded border border-muted-foreground/50 px-2 py-0.5 text-xs text-muted-foreground">
              {rating}
            </span>
            <span className="text-muted-foreground">{duration}</span>
            <span className="rounded border border-muted-foreground/50 px-2 py-0.5 text-xs text-muted-foreground">
              HD
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={handlePlayTrailer}
              disabled={isLoadingTrailer}
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 px-8"
            >
              <Play className="h-5 w-5 fill-current" />
              {isLoadingTrailer ? "로딩 중..." : "재생"}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-11 w-11 rounded-full border-2 border-muted-foreground/50 bg-transparent text-foreground hover:border-foreground hover:bg-transparent"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-11 w-11 rounded-full border-2 border-muted-foreground/50 bg-transparent text-foreground hover:border-foreground hover:bg-transparent"
            >
              <ThumbsUp className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-11 w-11 rounded-full border-2 border-muted-foreground/50 bg-transparent text-foreground hover:border-foreground hover:bg-transparent"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Description */}
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/90 md:text-base lg:text-lg">
            {description}
          </p>

          {/* Details Grid */}
          <div className="grid gap-4 pt-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="text-muted-foreground/70">출연: </span>
                {cast.slice(0, 3).join(", ")}
                {cast.length > 3 && (
                  <button className="ml-1 italic text-muted-foreground hover:underline">
                    더 보기
                  </button>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="text-muted-foreground/70">감독: </span>
                {director}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <span className="text-muted-foreground/70">장르: </span>
                {genres.join(", ")}
              </p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex items-center gap-2 pt-8 text-muted-foreground">
            <ChevronDown className="h-5 w-5 animate-bounce" />
            <span className="text-sm">아래로 스크롤하여 더 보기</span>
          </div>
        </div>
      </div>

      {/* 예고편 Dialog */}
      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{title} - 예고편</DialogTitle>
          </DialogHeader>
          <button
            onClick={() => setIsTrailerOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          {trailerKey && (
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                title={`${title} 예고편`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
