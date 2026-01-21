import { Header } from "@/components/header";
import { MovieDetailHero } from "@/components/movie-detail-hero";
import { EpisodeList } from "@/components/episode-list";
import { SimilarContent } from "@/components/similar-content";
import { getImagePath, getTVCredits, getTVDetails, getTVSeasonDetails, getSimilarTV } from "@/lib/tmdb";

interface TVDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TVDetailPage({ params }: TVDetailPageProps) {
  const { id } = await params;

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
  const mappedSimilarTV = similarTVData.slice(0, 8).map((tv: any) => ({
    id: tv.id,
    title: tv.name || tv.original_name, // TV는 name 사용
    imageUrl: getImagePath(tv.poster_path),
    year: tv.first_air_date?.slice(0, 4) || "",
    duration: tv.number_of_episodes ? `에피소드 ${tv.number_of_episodes}개` : "정보 없음",
    matchPercentage: tv.vote_average ? Math.floor(tv.vote_average * 10) : 75,
    rating: tv.adult ? "19+" : "15+",
    description: tv.overview || "",
  }));

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <MovieDetailHero {...heroData} />

      {/* 상세 정보 섹션 */}
      <section className="border-t border-border bg-card/50 px-6 py-8 md:px-12 lg:px-16">
        <h2 className="text-xl font-semibold text-foreground">상세 정보</h2>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p className="max-w-4xl leading-relaxed">
            {tv.overview || "상세 정보가 없습니다."}
          </p>
          {tv.number_of_seasons && (
            <p>
              <span className="font-semibold">총 시즌: </span>
              {tv.number_of_seasons}개
            </p>
          )}
          {tv.number_of_episodes && (
            <p>
              <span className="font-semibold">총 에피소드: </span>
              {tv.number_of_episodes}개
            </p>
          )}
          {tv.first_air_date && (
            <p>
              <span className="font-semibold">첫 방영: </span>
              {tv.first_air_date}
            </p>
          )}
          {tv.status && (
            <p>
              <span className="font-semibold">상태: </span>
              {tv.status === "Ended" ? "완결" : tv.status === "Returning Series" ? "방영 중" : tv.status}
            </p>
          )}
        </div>
      </section>

      {/* 에피소드 리스트 */}
      {episodes.length > 0 && (
        <EpisodeList
          tvId={id}
          initialEpisodes={episodes}
          seasonNumber={1}
          totalSeasons={tv.number_of_seasons || 1}
        />
      )}

      {/* 비슷한 콘텐츠 */}
      {mappedSimilarTV.length > 0 && <SimilarContent movies={mappedSimilarTV} hrefBase="tv" />}

      <footer className="border-t border-border px-6 py-12 md:px-12 lg:px-16">
        <p className="text-xs text-muted-foreground">© 2026 STREAMIX, Inc.</p>
      </footer>
    </main>
  );
}
