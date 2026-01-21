import { Header } from "@/components/header";
import { getTrendingTV, getImagePath } from "@/lib/tmdb";
import { MovieRow } from "@/components/movie-row";

// TV 시리즈 카테고리별 가져오기
async function getTVByCategory(category: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${category}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&page=1`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return data.results || [];
}

export default async function SeriesPage() {
  // 다양한 시리즈 카테고리 가져오기
  const [trending, popular, topRated, onTheAir] = await Promise.all([
    getTrendingTV(),
    getTVByCategory("popular"),
    getTVByCategory("top_rated"),
    getTVByCategory("on_the_air"),
  ]);

  const heroSeries = trending[0];

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      
      {/* 시리즈 히어로 섹션 */}
      <section className="relative h-[70vh] w-full">
        {heroSeries?.backdrop_path ? (
          <img 
            src={getImagePath(heroSeries.backdrop_path)} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt={heroSeries.name}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-end h-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            시리즈
          </h1>
          <p className="max-w-2xl text-lg mb-6 text-gray-200 drop-shadow-md">
            몰입감 넘치는 드라마와 시리즈를 무제한으로 즐기세요
          </p>
        </div>
      </section>

      {/* 시리즈 리스트 섹션 */}
      <div className="p-6 md:p-12 space-y-8 md:space-y-12 -mt-32 relative z-10">
        <MovieRow title="지금 뜨는 시리즈" movies={trending} hrefBase="tv" />
        <MovieRow title="인기 시리즈" movies={popular} hrefBase="tv" />
        <MovieRow title="최고 평점 시리즈" movies={topRated} hrefBase="tv" />
        <MovieRow title="방영 중인 시리즈" movies={onTheAir} hrefBase="tv" />
      </div>
    </main>
  );
}
