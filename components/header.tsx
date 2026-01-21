"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getImagePath } from "@/lib/tmdb";

/**
 * Header 컴포넌트: 
 * 스크롤 상태에 따라 배경색이 변하며, 로고, 내비게이션, 사용자 메뉴를 포함합니다.
 * 확장형 검색 시스템 포함
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 검색 활성화 시 입력창에 포커스
  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  // 검색어 변경 시 디바운싱 처리
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(searchQuery)}&page=1&include_adult=false`
        );
        const data = await response.json();
        const results = (data.results || []).filter(
          (item: any) => item.media_type === "movie" || item.media_type === "tv"
        );
        setSearchResults(results.slice(0, 10)); // 최대 10개만 표시
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms 디바운싱

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // 검색 닫기
  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header
      className={cn(
        // [기본 스타일]: 화면 상단 고정, 최상위 레이어(z-50), 부드러운 색상 변화(duration-300)
        "fixed top-0 z-50 w-full px-6 py-4 transition-colors duration-300 md:px-12 lg:px-16",
        
        // [조건부 스타일]: 
        // 스크롤 됨 -> 배경색 채움 (bg-background)
        // 스크롤 안 됨 -> 위에서 아래로 투명해지는 그라데이션 (bg-gradient-to-b)
        isScrolled 
          ? "bg-background shadow-md" 
          : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        
        {/* --- 왼쪽 섹션: 로고 및 내비게이션 --- */}
        <div className={cn(
          "flex items-center gap-8 flex-1 relative transition-all duration-300",
          isSearchActive && "hidden md:flex" // 모바일에서 검색 활성화 시 숨김, 데스크탑에서는 유지
        )}>
          {/* 로고 영역 (메뉴가 이 뒤로 숨겨짐) */}
          <div className="relative z-10 pr-8 overflow-hidden">
            <Link href="/" className="text-2xl font-bold tracking-tight text-primary md:text-3xl cursor-pointer flex-shrink-0 relative z-20">
              STREAMIX
            </Link>
          </div>

          {/* 데스크탑 내비게이션: 검색 활성화 시 로고 뒤로 숨김 */}
          <nav 
            className="hidden items-center gap-5 md:flex absolute left-[180px] z-0"
          >
            <NavItem href="/" label="홈" active={pathname === "/"} delay={0} isHiding={isSearchActive} />
            <NavItem href="/series" label="시리즈" active={pathname === "/series"} delay={80} isHiding={isSearchActive} />
            <NavItem href="/movies" label="영화" active={pathname === "/movies"} delay={160} isHiding={isSearchActive} />
            <NavItem href="/trending" label="NEW! 요즘 대세 콘텐츠" active={pathname === "/trending"} delay={240} isHiding={isSearchActive} />
            <NavItem href="/my-list" label="내가 찜한 리스트" active={pathname === "/my-list"} delay={320} isHiding={isSearchActive} />
          </nav>

          {/* 모바일 메뉴 버튼: 작은 화면에서만 표시 */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-1 text-sm text-foreground md:hidden"
          >
            메뉴
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-300",
              isMobileMenuOpen && "rotate-180"
            )} />
          </button>
        </div>

        {/* --- 오른쪽 섹션: 검색, 알림, 프로필 --- */}
        <div className={cn(
          "flex items-center gap-4",
          isSearchActive && "w-full md:w-auto" // 모바일에서 검색 활성화 시 전체 너비
        )}>
          {/* 검색: 버튼 또는 확장형 입력창 */}
          <div className={cn(
            "relative flex items-center",
            isSearchActive && "flex-1" // 검색 활성화 시 전체 너비 사용
          )}>
            {!isSearchActive ? (
              <button 
                onClick={() => setIsSearchActive(true)}
                className="text-foreground hover:text-muted-foreground transition-colors p-1"
              >
                <Search className="h-5 w-5" />
              </button>
            ) : (
              <div 
                className={cn(
                  "flex items-center transition-all duration-500 ease-out",
                  "w-full md:w-[800px]", // 모바일: 전체 너비, 데스크탑: 800px
                  isSearchActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                )}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="영화, 시리즈를 검색하세요..."
                    className="w-full bg-black/50 border border-white/20 rounded-full pl-10 md:pl-12 pr-10 md:pr-12 py-2 md:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg"
                  />
                  {isSearching ? (
                    <Loader2 className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                  ) : (
                    <button
                      onClick={handleCloseSearch}
                      className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-foreground hover:text-muted-foreground transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* 알림 버튼 (검색 활성화 시 모바일에서 숨김) */}
          <button className={cn(
            "text-foreground hover:text-muted-foreground transition-colors p-1",
            isSearchActive && "hidden md:block"
          )}>
            <Bell className="h-5 w-5" />
          </button>
          
          {/* 프로필 섹션 (검색 활성화 시 모바일에서 숨김) */}
          <button className={cn(
            "flex items-center gap-2 group",
            isSearchActive && "hidden md:flex"
          )}>
            {/* 프로필 이미지 박스 (primary 컬러 배경) */}
            <div className="h-8 w-8 rounded bg-primary transition-transform group-hover:scale-105" />
            {/* 드롭다운 화살표 */}
            <ChevronDown className="hidden h-4 w-4 text-foreground md:block transition-transform group-hover:rotate-180" />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full bg-black/95 backdrop-blur-md border-t border-white/10 md:hidden z-50">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            <MobileNavItem 
              href="/" 
              label="홈" 
              active={pathname === "/"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavItem 
              href="/series" 
              label="시리즈" 
              active={pathname === "/series"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavItem 
              href="/movies" 
              label="영화" 
              active={pathname === "/movies"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavItem 
              href="/trending" 
              label="NEW! 요즘 대세 콘텐츠" 
              active={pathname === "/trending"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileNavItem 
              href="/my-list" 
              label="내가 찜한 리스트" 
              active={pathname === "/my-list"} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>
        </div>
      )}

      {/* 블러 오버레이 (검색 활성화 시 뒤쪽 콘텐츠 흐리게) */}
      {isSearchActive && searchQuery.trim() && (
        <div className="fixed inset-0 top-[72px] bg-black/40 backdrop-blur-md z-40" onClick={handleCloseSearch} />
      )}

      {/* 메가메뉴 검색 결과 */}
      {isSearchActive && searchQuery.trim() && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-black/95 backdrop-blur-xl border-t border-white/10 shadow-2xl max-h-[70vh] overflow-y-auto z-50">
          <div className="px-6 py-6 md:px-12 lg:px-16">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  검색 결과 {searchResults.length}개
                </p>
                <div className="grid gap-3">
                  {searchResults.map((item) => {
                    const isTV = item.media_type === "tv";
                    const title = isTV ? item.name : item.title;
                    const year = isTV 
                      ? item.first_air_date?.slice(0, 4) 
                      : item.release_date?.slice(0, 4);
                    const href = isTV ? `/tv/${item.id}` : `/movie/${item.id}`;

                    return (
                      <Link
                        key={item.id}
                        href={href}
                        onClick={handleCloseSearch}
                        className="flex gap-4 rounded-md bg-card/50 p-3 transition-all hover:bg-card/80 hover:scale-[1.02] group"
                      >
                        {/* 썸네일 */}
                        <div className="relative w-20 h-28 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          {item.poster_path ? (
                            <Image
                              src={getImagePath(item.poster_path)}
                              alt={title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-xs text-muted-foreground">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* 정보 */}
                        <div className="flex flex-1 flex-col justify-center space-y-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded bg-white/10 px-2 py-0.5">
                              {isTV ? "시리즈" : "영화"}
                            </span>
                            {year && <span>{year}</span>}
                            {item.vote_average && (
                              <span className="flex items-center gap-1">
                                ⭐ {item.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                          {item.overview && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {item.overview}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  '{searchQuery}'에 대한 검색 결과가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * 내비게이션 아이템 전용 하위 컴포넌트 (코드 가독성을 위해 분리)
 */
function NavItem({ 
  href, 
  label, 
  active = false, 
  delay = 0, 
  isHiding = false 
}: { 
  href: string; 
  label: string; 
  active?: boolean;
  delay?: number;
  isHiding?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-all duration-700 hover:text-foreground/80 whitespace-nowrap",
        active ? "text-foreground font-bold" : "text-muted-foreground",
        isHiding && "opacity-0 -translate-x-[200px]"
      )}
      style={{
        transitionDelay: isHiding ? `${delay}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {label}
    </Link>
  );
}

/**
 * 모바일 내비게이션 아이템
 */
function MobileNavItem({ 
  href, 
  label, 
  active = false,
  onClick
}: { 
  href: string; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-base font-medium transition-colors hover:text-foreground py-2 px-3 rounded-md",
        active 
          ? "text-foreground font-bold bg-white/10" 
          : "text-muted-foreground hover:bg-white/5"
      )}
    >
      {label}
    </Link>
  );
}