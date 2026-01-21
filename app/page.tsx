import { Header } from "@/components/header";
import { getMovies, getImagePath, getMovieDetails, getTrendingTV } from "@/lib/tmdb";
import { MovieRow } from "@/components/movie-row";
import Link from "next/link";

export default async function Page() {
  // 카테고리별로 영화 가져오기
  const trendingMovies = await getMovies("popular");
  const nowPlaying = await getMovies("now_playing");
  const topRated = await getMovies("top_rated");
  const trendingTV = await getTrendingTV();

  const heroMovie = trendingMovies[0]; // 히어로 섹션에 띄울 영화
  
  // 히어로 영화의 상세 정보 가져오기 (장르 등 추가 정보)
  const heroMovieDetails = await getMovieDetails(heroMovie.id);

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      
      {/* 히어로 섹션 */}
      <section className="relative h-[80vh] w-full">
        {heroMovie.backdrop_path ? (
          <img 
            src={getImagePath(heroMovie.backdrop_path)} 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt={heroMovie.title}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}
        
        {/* 어둡게 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-end h-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            {heroMovie.title}
          </h1>
          
          {/* 영화 메타 정보 */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm md:text-base">
            {heroMovie.release_date && (
              <span className="text-gray-200">{heroMovie.release_date.slice(0, 4)}</span>
            )}
            {heroMovieDetails.runtime && (
              <span className="text-gray-200">{heroMovieDetails.runtime}분</span>
            )}
            {heroMovie.vote_average && (
              <span className="rounded bg-white/20 px-2 py-1 text-xs md:text-sm">
                ⭐ {heroMovie.vote_average.toFixed(1)}
              </span>
            )}
            {heroMovieDetails.genres && heroMovieDetails.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {heroMovieDetails.genres.slice(0, 3).map((genre: { id: number; name: string }) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-white/20 px-3 py-1 text-xs"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {heroMovie.overview && (
            <p className="max-w-2xl text-sm md:text-lg mb-6 text-gray-200 drop-shadow-md line-clamp-3">
              {heroMovie.overview}
            </p>
          )}
          
          <div className="flex gap-4">
            <button className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-200 transition-colors">
              재생
            </button>
            <Link 
              href={`/movie/${heroMovie.id}`}
              className="bg-gray-500/50 text-white px-6 md:px-8 py-2 md:py-3 rounded font-bold hover:bg-gray-500/70 transition-colors"
            >
              상세 정보
            </Link>
          </div>
        </div>
      </section>

      {/* 영화 리스트 섹션 */}
      <div className="p-6 md:p-12 space-y-8 md:space-y-12">
        <MovieRow title="지금 뜨는 시리즈" movies={trendingTV} hrefBase="tv" />
        <MovieRow title="지금 뜨는 콘텐츠" movies={trendingMovies} />
        <MovieRow title="현재 상영 중" movies={nowPlaying} />
        <MovieRow title="최고 평점 영화" movies={topRated} />
      </div>
    </main>
  );
}
