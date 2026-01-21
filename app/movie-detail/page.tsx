'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { MovieDetailHero } from "@/components/movie-detail-hero";
import { SimilarContent } from "@/components/similar-content";
import { getImagePath, getMovieDetails, getSimilarMovies, getMovieCredits } from "@/lib/tmdb";

function MovieDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      setLoading(true);
      try {
        const [movie, similarMoviesData, credits] = await Promise.all([
          getMovieDetails(id),
          getSimilarMovies(id),
          getMovieCredits(id),
        ]);

        // 출연진 추출 (최대 5명)
        const cast = credits.cast?.slice(0, 5).map((actor: any) => actor.name) || [];
        
        // 감독 추출
        const director = credits.crew?.find((person: any) => person.job === "Director")?.name || "정보 없음";

        // 매치 퍼센트 계산 (평점 기반)
        const matchPercentage = movie.vote_average ? Math.floor(movie.vote_average * 10) : 85;

        // 1. 메인 히어로 데이터 매핑
        const movieDisplayData = {
          title: movie.title || "제목 없음",
          backgroundImage: getImagePath(movie.backdrop_path),
          year: movie.release_date?.slice(0, 4) || "",
          rating: movie.vote_average ? `평점 ${movie.vote_average.toFixed(1)}` : "N/A",
          duration: movie.runtime ? `${movie.runtime}분` : "정보 없음",
          matchPercentage,
          description: movie.overview || "상세 정보가 없습니다.",
          genres: movie.genres?.map((g: any) => g.name) || [],
          cast,
          director,
          contentId: id,
          contentType: "movie" as const,
        };

        // 2. 비슷한 콘텐츠 데이터 매핑
        const mappedSimilarMovies = similarMoviesData.slice(0, 8).map((m: any) => ({
          id: m.id,
          title: m.title,
          imageUrl: getImagePath(m.poster_path),
          year: m.release_date?.slice(0, 4) || "",
          duration: m.runtime ? `${m.runtime}분` : "정보 없음",
          matchPercentage: m.vote_average ? Math.floor(m.vote_average * 10) : 75,
          rating: m.adult ? "19+" : "15+",
          description: m.overview || ""
        }));

        setData({ movie, movieDisplayData, mappedSimilarMovies });
      } catch (error) {
        console.error('Failed to fetch movie data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (!id) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Invalid movie ID</div>
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
      <MovieDetailHero {...data.movieDisplayData} />

      {/* 상세 정보 섹션 */}
      <section className="border-t border-border bg-card/50 px-6 py-8 md:px-12 lg:px-16">
        <h2 className="text-xl font-semibold text-foreground">상세 정보</h2>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-4xl">
          {data.movie.overview || "상세 정보가 없습니다."}
        </p>
      </section>

      {/* 3. 매핑된 데이터를 전달 */}
      <SimilarContent movies={data.mappedSimilarMovies} />

      <footer className="border-t border-border px-6 py-12 md:px-12 lg:px-16">
        <p className="text-xs text-muted-foreground">© 2026 STREAMIX, Inc.</p>
      </footer>
    </main>
  );
}

export default function MovieDetailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <MovieDetailContent />
    </Suspense>
  );
}
