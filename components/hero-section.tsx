"use client";

import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Featured movie background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-32 md:px-12 lg:px-16">
        <div className="max-w-2xl space-y-4">
          {/* Netflix Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-widest text-primary">
              N
            </span>
            <span className="text-xs font-medium tracking-wider text-muted-foreground">
              시리즈
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
            어둠 속의 빛
          </h1>

          {/* Description */}
          <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base lg:text-lg">
            거대한 음모 속에서 진실을 찾아 나서는 한 형사의 이야기. 
            어둠 속에서 빛나는 정의를 위해, 그는 모든 것을 걸어야 한다. 
            숨 막히는 긴장감과 예측 불가능한 반전이 기다린다.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 px-6"
            >
              <Play className="h-5 w-5 fill-current" />
              재생
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-muted/80 text-foreground hover:bg-muted font-semibold gap-2 px-6"
            >
              <Info className="h-5 w-5" />
              상세 정보
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
