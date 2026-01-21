import { Header } from "@/components/header";

export default function MyListPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Header />
      
      {/* 찜한 리스트 히어로 섹션 */}
      <section className="relative h-[50vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black" />
        
        <div className="relative z-10 p-12 flex flex-col justify-end h-full">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            내가 찜한 리스트
          </h1>
          <p className="max-w-2xl text-lg mb-6 text-gray-200 drop-shadow-md">
            나중에 볼 콘텐츠를 저장하고 관리하세요
          </p>
        </div>
      </section>

      {/* 찜한 리스트 콘텐츠 */}
      <div className="p-6 md:p-12 space-y-8 md:space-y-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📺</div>
          <h2 className="text-2xl font-bold mb-2">찜한 콘텐츠가 없습니다</h2>
          <p className="text-gray-400 text-center max-w-md">
            마음에 드는 영화나 시리즈를 찜하면 여기에 표시됩니다.
            <br />
            콘텐츠를 둘러보고 + 버튼을 눌러보세요!
          </p>
        </div>
      </div>
    </main>
  );
}
