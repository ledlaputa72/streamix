import { Header } from "@/components/header";
import { getTrendingTV, getMovies, getImagePath } from "@/lib/tmdb";
import { MovieRow } from "@/components/movie-row";

// 트렌딩 영화 가져오기
async function getTrendingMovies() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return data.results || [];
}

export default async function TrendingPage() {
  // 트렌딩 콘텐츠 가져오기
  const [trendingMovies, trendingTV, popular] = await Promise.all([
    getTrendingMovies(),
    getTrendingTV(),
    getMovies("popular"),
  ]);

  const heroContent = trendingMovies[0];

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      
      {/* 트렌딩 히어로 섹션 */}
      <section className="relative h-[70vh] w-full">
        {heroContent?.backdrop_path ? (
          <img 
            src={getImagePath(heroContent.backdrop_path)} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt={heroContent.title}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-black" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-end h-full">
          <div className="inline-block px-4 py-2 bg-red-600 text-white font-bold text-sm rounded mb-4 w-fit">
            NEW! 요즘 대세
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            요즘 대세 콘텐츠
          </h1>
          <p className="max-w-2xl text-lg mb-6 text-gray-200 drop-shadow-md">
            지금 가장 핫한 영화와 시리즈를 확인하세요
          </p>
        </div>
      </section>

      {/* 트렌딩 리스트 섹션 */}
      <div className="p-6 md:p-12 space-y-8 md:space-y-12 -mt-32 relative z-10">
        <MovieRow title="이번 주 트렌딩 영화" movies={trendingMovies} />
        <MovieRow title="이번 주 트렌딩 시리즈" movies={trendingTV} hrefBase="tv" />
        <MovieRow title="인기 급상승 콘텐츠" movies={popular} />
      </div>
    </main>
  );
}
