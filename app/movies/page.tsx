import { Header } from "@/components/header";
import { getMovies, getImagePath } from "@/lib/tmdb";
import { MovieRow } from "@/components/movie-row";

export default async function MoviesPage() {
  // 다양한 영화 카테고리 가져오기
  const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
    getMovies("popular"),
    getMovies("now_playing"),
    getMovies("top_rated"),
    getMovies("upcoming"),
  ]);

  const heroMovie = popular[0];

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      
      {/* 영화 히어로 섹션 */}
      <section className="relative h-[70vh] w-full">
        {heroMovie.backdrop_path ? (
          <img 
            src={getImagePath(heroMovie.backdrop_path)} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt={heroMovie.title}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-end h-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            영화
          </h1>
          <p className="max-w-2xl text-lg mb-6 text-gray-200 drop-shadow-md">
            최신 영화부터 클래식까지, 다양한 장르의 영화를 만나보세요
          </p>
        </div>
      </section>

      {/* 영화 리스트 섹션 */}
      <div className="p-6 md:p-12 space-y-8 md:space-y-12 -mt-32 relative z-10">
        <MovieRow title="인기 영화" movies={popular} />
        <MovieRow title="현재 상영 중" movies={nowPlaying} />
        <MovieRow title="최고 평점 영화" movies={topRated} />
        <MovieRow title="개봉 예정" movies={upcoming} />
      </div>
    </main>
  );
}
