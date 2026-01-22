'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { MovieDetailHero } from "@/components/movie-detail-hero";
import { EpisodeList } from "@/components/episode-list";
import { SimilarContent } from "@/components/similar-content";
import { getImagePath, getTVCredits, getTVDetails, getTVSeasonDetails, getSimilarTV } from "@/lib/tmdb";

function TVDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      setLoading(true);
      try {
        // 병렬로 모든 데이터 가져오기
        const [tv, credits, seasonData, similarTVData] = await Promise.all([
          getTVDetails(id),
          getTVCredits(id),
          getTVSeasonDetails(id, 1), // 시즌 1의 에피소드 정보
          getSimilarTV(id),
        ]);

        // 출연진 (최대 5명)
        const cast: string[] = credits.cast?.slice(0, 5).map((p: any) => p.name) || [];

        // TV는 "감독" 개념이 영화처럼 명확하지 않아서, 제작자(created_by)를 우선 표기
        const director =
          tv.created_by?.[0]?.name ||
          credits.crew?.find((p: any) => p.job === "Director")?.name ||
          "정보 없음";

        const voteAverage = typeof tv.vote_average === "number" ? tv.vote_average : undefined;
        const matchPercentage = voteAverage ? Math.floor(voteAverage * 10) : 85;

        // 시즌 개수 표시
        const duration = tv.number_of_seasons
          ? `시즌 ${tv.number_of_seasons}개`
          : typeof tv.episode_run_time?.[0] === "number"
          ? `${tv.episode_run_time[0]}분`
          : "정보 없음";

        const heroData = {
          title: tv.name || tv.original_name || "제목 없음",
          backgroundImage: getImagePath(tv.backdrop_path),
          year: tv.first_air_date?.slice(0, 4) || "",
          rating: voteAverage ? `평점 ${voteAverage.toFixed(1)}` : "N/A",
          duration,
          matchPercentage,
          description: tv.overview || "상세 정보가 없습니다.",
          genres: tv.genres?.map((g: any) => g.name) || [],
          cast,
          director,
          contentId: id,
          contentType: "tv" as const,
        };

        // 에피소드 데이터 매핑
        const episodes = seasonData.episodes || [];

        // 비슷한 TV 시리즈 데이터 매핑 (SimilarContent 컴포넌트 형식에 맞춤)
        const mappedSimilarTV = similarTVData.slice(0, 8).map((tvItem: any) => ({
          id: tvItem.id,
          title: tvItem.name || tvItem.original_name, // TV는 name 사용
          imageUrl: getImagePath(tvItem.poster_path),
          year: tvItem.first_air_date?.slice(0, 4) || "",
          duration: tvItem.number_of_episodes ? `에피소드 ${tvItem.number_of_episodes}개` : "정보 없음",
          matchPercentage: tvItem.vote_average ? Math.floor(tvItem.vote_average * 10) : 75,
          rating: tvItem.adult ? "19+" : "15+",
          description: tvItem.overview || "",
        }));

        setData({ tv, heroData, episodes, mappedSimilarTV });
      } catch (error) {
        console.error('Failed to fetch TV data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (!id) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Invalid TV show ID</div>
      </main>
    );
  }

  if (loading || !data) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <MovieDetailHero {...data.heroData} />

      {/* 상세 정보 섹션 */}
      <section className="border-t border-border bg-card/50 px-6 py-8 md:px-12 lg:px-16">
        <h2 className="text-xl font-semibold text-foreground">상세 정보</h2>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p className="max-w-4xl leading-relaxed">
            {data.tv.overview || "상세 정보가 없습니다."}
          </p>
          {data.tv.number_of_seasons && (
            <p>
              <span className="font-semibold">총 시즌: </span>
              {data.tv.number_of_seasons}개
            </p>
          )}
          {data.tv.number_of_episodes && (
            <p>
              <span className="font-semibold">총 에피소드: </span>
              {data.tv.number_of_episodes}개
            </p>
          )}
          {data.tv.first_air_date && (
            <p>
              <span className="font-semibold">첫 방영: </span>
              {data.tv.first_air_date}
            </p>
          )}
          {data.tv.status && (
            <p>
              <span className="font-semibold">상태: </span>
              {data.tv.status === "Ended" ? "완결" : data.tv.status === "Returning Series" ? "방영 중" : data.tv.status}
            </p>
          )}
        </div>
      </section>

      {/* 에피소드 리스트 */}
      {data.episodes.length > 0 && (
        <EpisodeList
          tvId={id}
          initialEpisodes={data.episodes}
          seasonNumber={1}
          totalSeasons={data.tv.number_of_seasons || 1}
        />
      )}

      {/* 비슷한 콘텐츠 */}
      {data.mappedSimilarTV.length > 0 && <SimilarContent movies={data.mappedSimilarTV} hrefBase="tv" />}

      <footer className="border-t border-border px-6 py-12 md:px-12 lg:px-16">
        <p className="text-xs text-muted-foreground">© 2026 STREAMIX, Inc.</p>
      </footer>
    </main>
  );
}

export default function TVDetailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <TVDetailContent />
    </Suspense>
  );
}
