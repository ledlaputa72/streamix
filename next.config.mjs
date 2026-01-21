/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 정적 사이트로 빌드 (Capacitor 필수)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // 정적 내보내기 시 이미지 최적화는 비활성화해야 합니다.
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