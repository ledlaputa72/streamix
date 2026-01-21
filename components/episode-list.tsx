"use client";

import { useState, useEffect } from "react";
import { Play, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { getImagePath } from "@/lib/tmdb";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  air_date: string;
}

interface EpisodeListProps {
  tvId: string;
  initialEpisodes: Episode[];
  seasonNumber: number;
  totalSeasons: number;
}

export function EpisodeList({ tvId, initialEpisodes, seasonNumber, totalSeasons }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState(seasonNumber);
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [isLoading, setIsLoading] = useState(false);

  // 시즌 변경 시 에피소드 데이터 가져오기
  useEffect(() => {
    const fetchSeasonEpisodes = async () => {
      if (selectedSeason === seasonNumber && episodes.length > 0) {
        // 초기 시즌이면 이미 데이터가 있으므로 API 호출 안 함
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${tvId}/season/${selectedSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
        );
        const data = await response.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Failed to fetch season episodes:", error);
        setEpisodes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasonEpisodes();
  }, [selectedSeason, tvId, seasonNumber, episodes.length]);

  return (
    <section className="px-6 py-12 md:px-12 lg:px-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl">
          에피소드
        </h2>
        
        {/* 시즌 선택 드롭다운 */}
        <div className="relative">
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="appearance-none rounded border border-border bg-card px-4 py-2 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((season) => (
              <option key={season} value={season}>
                시즌 {season}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* 에피소드 리스트 */}
      <div className="space-y-4">
        {isLoading ? (
          // 로딩 스켈레톤 UI
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">에피소드를 불러오는 중...</p>
          </div>
        ) : episodes.length === 0 ? (
          // 에피소드가 없을 때
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">이 시즌의 에피소드 정보가 없습니다.</p>
          </div>
        ) : (
          // 에피소드 목록
          episodes.map((episode) => (
          <div
            key={episode.id}
            className="group flex gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
          >
            {/* 에피소드 번호 */}
            <div className="flex-shrink-0 text-2xl font-bold text-muted-foreground">
              {episode.episode_number}
            </div>

            {/* 에피소드 이미지 */}
            <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-md md:w-40">
              {episode.still_path ? (
                <Image
                  src={getImagePath(episode.still_path)}
                  alt={episode.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-xs text-muted-foreground">이미지 없음</span>
                </div>
              )}
              {/* Play 버튼 (hover 시) */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background">
                  <Play className="h-4 w-4 fill-current" />
                </button>
              </div>
            </div>

            {/* 에피소드 정보 */}
            <div className="flex flex-1 flex-col justify-center space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{episode.name}</h3>
                {episode.runtime && (
                  <span className="text-sm text-muted-foreground">{episode.runtime}분</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {episode.overview || "에피소드 설명이 없습니다."}
              </p>
            </div>
          </div>
          ))
        )}
      </div>
    </section>
  );
}
