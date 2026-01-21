const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

export async function getMovies(category: string) {
  const response = await fetch(
    `${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=ko-KR&page=1`,
    { next: { revalidate: 3600 } } // 1시간마다 데이터 갱신
  );
  const data = await response.json();
  return data.results;
}

// 단일 영화 상세 정보 가져오기
export async function getMovieDetails(id: string | number) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ko-KR`,
    { next: { revalidate: 3600 } } // 1시간마다 데이터 갱신
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details for id: ${id}`);
  }

  return response.json();
}

// 이미지 경로를 실제 URL로 바꿔주는 함수
export function getImagePath(path: string | null | undefined) {
  if (!path) return "/placeholder.svg";
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${path}`;
}

// 비슷한 영화 가져오기
export async function getSimilarMovies(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  const data = await res.json();
  return data.results || [];
}

// 추천 영화 가져오기
export async function getRecommendations(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  const data = await res.json();
  return data.results || [];
}

// 영화 크레딧 정보 가져오기 (출연진, 감독 등)
export async function getMovieCredits(id: string | number) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=ko-KR`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movie credits for id: ${id}`);
  }

  return response.json();
}

// TV 시리즈 상세 정보 가져오기
export async function getTVDetails(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  return res.json();
}

// TV 시리즈 크레딧 정보 가져오기 (출연진 등)
export async function getTVCredits(id: string | number) {
  const response = await fetch(
    `${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}&language=ko-KR`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tv credits for id: ${id}`);
  }

  return response.json();
}

// 인기 TV 시리즈 목록 가져오기 (메인 페이지용)
export async function getTrendingTV() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/tv/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  const data = await res.json();
  return data.results || [];
}

// 비슷한 TV 시리즈 가져오기
export async function getSimilarTV(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  const data = await res.json();
  return data.results || [];
}

// 특정 시즌의 에피소드 정보 가져오기 (시즌 1을 기본으로 가져올 때 사용)
export async function getTVSeasonDetails(tvId: string, seasonNumber: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  return res.json();
}

// 영화 또는 TV 시리즈의 예고편(Video) 가져오기
export async function getVideos(id: string | number, type: "movie" | "tv" = "movie") {
  const response = await fetch(
    `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=ko-KR`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch videos for ${type} id: ${id}`);
  }

  const data = await response.json();
  
  // YouTube 비디오만 필터링하고 Trailer 타입 우선
  const videos = data.results || [];
  const youtubeVideos = videos.filter((video: any) => video.site === "YouTube");
  
  // Trailer 타입을 우선적으로 찾고, 없으면 첫 번째 비디오 반환
  const trailer = youtubeVideos.find((video: any) => video.type === "Trailer");
  const teaser = youtubeVideos.find((video: any) => video.type === "Teaser");
  
  return {
    results: youtubeVideos,
    trailer: trailer || teaser || youtubeVideos[0] || null,
  };
}

// 통합 검색 (영화 + TV 시리즈)
export async function searchMulti(query: string) {
  if (!query.trim()) return [];
  
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}&page=1&include_adult=false`
  );

  if (!response.ok) {
    throw new Error(`Failed to search for query: ${query}`);
  }

  const data = await response.json();
  
  // 영화와 TV만 필터링 (사람 제외)
  return (data.results || []).filter(
    (item: any) => item.media_type === "movie" || item.media_type === "tv"
  );
}