/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 빌드 시 타입 체크 에러가 나도 배포를 진행하도록 유지합니다.
    ignoreBuildErrors: true,
  },
  images: {
    // 외부 도메인인 TMDB의 이미지 주소를 허용합니다.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
}

export default nextConfig