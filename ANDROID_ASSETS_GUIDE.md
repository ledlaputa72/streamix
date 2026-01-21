# 📱 Android 앱 아이콘 & 스플래시 화면 교체 가이드

## 🎨 1. 앱 아이콘 (App Icon) 교체

### 필요한 이미지 사이즈

앱 아이콘은 여러 해상도가 필요합니다:

| 폴더 | 사이즈 (px) | 용도 |
|------|------------|------|
| `mipmap-mdpi` | 48×48 | 저해상도 |
| `mipmap-hdpi` | 72×72 | 중해상도 |
| `mipmap-xhdpi` | 96×96 | 고해상도 |
| `mipmap-xxhdpi` | 144×144 | 초고해상도 |
| `mipmap-xxxhdpi` | 192×192 | 최고해상도 |

### 자동 생성 도구 (권장)

#### 방법 1: Android Asset Studio 사용
1. https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html 접속
2. 원본 이미지 업로드 (최소 512×512 PNG 권장)
3. 설정 조정 후 다운로드
4. 다운로드한 파일을 아래 경로에 복사

#### 방법 2: 수동 교체

**교체할 파일 위치:**
```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png           (48×48)
│   ├── ic_launcher_round.png     (48×48)
│   └── ic_launcher_foreground.png
├── mipmap-hdpi/
│   ├── ic_launcher.png           (72×72)
│   ├── ic_launcher_round.png     (72×72)
│   └── ic_launcher_foreground.png
├── mipmap-xhdpi/
│   ├── ic_launcher.png           (96×96)
│   ├── ic_launcher_round.png     (96×96)
│   └── ic_launcher_foreground.png
├── mipmap-xxhdpi/
│   ├── ic_launcher.png           (144×144)
│   ├── ic_launcher_round.png     (144×144)
│   └── ic_launcher_foreground.png
└── mipmap-xxxhdpi/
    ├── ic_launcher.png           (192×192)
    ├── ic_launcher_round.png     (192×192)
    └── ic_launcher_foreground.png
```

### Capacitor를 사용한 자동 아이콘 생성

1. 프로젝트 루트에 `icon.png` 파일 생성 (1024×1024 PNG)

2. `capacitor.config.ts`에 설정 추가:
```typescript
const config: CapacitorConfig = {
  appId: 'com.ledlaputa.streamix',
  appName: 'STREAMIX',
  webDir: 'out',
  // 아이콘 자동 생성 설정
  android: {
    icon: {
      sources: {
        foreground: 'icon.png',
        background: '#000000' // 배경색
      }
    }
  }
};
```

3. 명령어 실행:
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

---

## 🌅 2. 스플래시 화면 (Splash Screen) 교체

### 필요한 이미지 사이즈

스플래시 이미지는 가로/세로 방향별로 필요합니다:

#### 세로 방향 (Portrait)
```
drawable-port-mdpi/     320×480
drawable-port-hdpi/     480×800
drawable-port-xhdpi/    720×1280
drawable-port-xxhdpi/   1080×1920
drawable-port-xxxhdpi/  1440×2560
```

#### 가로 방향 (Landscape)
```
drawable-land-mdpi/     480×320
drawable-land-hdpi/     800×480
drawable-land-xhdpi/    1280×720
drawable-land-xxhdpi/   1920×1080
drawable-land-xxxhdpi/  2560×1440
```

### 자동 생성 방법

#### 방법 1: Capacitor Assets 플러그인 사용 (권장)

1. 프로젝트 루트에 `splash.png` 생성 (2732×2732 PNG)
   - 중앙의 1200×1200 영역에 로고 배치
   - 나머지는 배경색

2. `capacitor.config.ts` 설정:
```typescript
const config: CapacitorConfig = {
  appId: 'com.ledlaputa.streamix',
  appName: 'STREAMIX',
  webDir: 'out',
  android: {
    splash: {
      backgroundColor: '#000000',
      image: 'splash.png',
      showSpinner: true,
      spinnerColor: '#E50914' // Netflix Red
    }
  }
};
```

3. 명령어 실행:
```bash
npx capacitor-assets generate --android
```

#### 방법 2: 수동 교체

**교체할 파일 위치:**
```
android/app/src/main/res/
├── drawable-land-hdpi/splash.png
├── drawable-land-mdpi/splash.png
├── drawable-land-xhdpi/splash.png
├── drawable-land-xxhdpi/splash.png
├── drawable-land-xxxhdpi/splash.png
├── drawable-port-hdpi/splash.png
├── drawable-port-mdpi/splash.png
├── drawable-port-xhdpi/splash.png
├── drawable-port-xxhdpi/splash.png
└── drawable-port-xxxhdpi/splash.png
```

### 스플래시 설정 커스터마이징

`android/app/src/main/res/values/styles.xml` 수정:

```xml
<resources>
    <style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
        <item name="android:background">@drawable/splash</item>
        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
        <!-- 배경색 설정 -->
        <item name="android:windowBackground">@color/splash_background</item>
        <!-- 스플래시 아이콘 -->
        <item name="windowSplashScreenAnimatedIcon">@drawable/splash</item>
        <!-- 스플래시 배경색 -->
        <item name="windowSplashScreenBackground">#000000</item>
        <!-- 애니메이션 시간 -->
        <item name="windowSplashScreenAnimationDuration">300</item>
    </style>
</resources>
```

---

## 🔄 3. 변경사항 적용

### 단계별 적용 방법

1. **이미지 파일 준비**
   - 앱 아이콘: `icon.png` (1024×1024)
   - 스플래시: `splash.png` (2732×2732)

2. **Capacitor Assets 설치**
   ```bash
   npm install @capacitor/assets --save-dev
   ```

3. **자동 생성 실행**
   ```bash
   npx capacitor-assets generate --android
   ```

4. **프로젝트 동기화**
   ```bash
   npm run build
   npx cap sync android
   ```

5. **Android Studio에서 확인**
   ```bash
   npx cap open android
   ```

---

## 🎯 4. 빠른 시작 체크리스트

- [ ] 1024×1024 PNG 앱 아이콘 준비 (`icon.png`)
- [ ] 2732×2732 PNG 스플래시 이미지 준비 (`splash.png`)
- [ ] `@capacitor/assets` 패키지 설치
- [ ] `capacitor.config.ts`에 아이콘/스플래시 설정 추가
- [ ] `npx capacitor-assets generate` 실행
- [ ] `npm run build && npx cap sync android` 실행
- [ ] Android Studio에서 결과 확인

---

## 💡 팁

### 아이콘 디자인 가이드라인
- ✅ 투명 배경 사용
- ✅ 단순하고 인식하기 쉬운 디자인
- ✅ 중앙 70% 영역에 중요한 요소 배치
- ❌ 텍스트는 최소화 (작은 크기에서 읽기 어려움)

### 스플래시 화면 디자인
- ✅ 브랜드 컬러 사용
- ✅ 중앙에 로고 배치
- ✅ 로딩 인디케이터 표시
- ❌ 너무 복잡한 디자인 피하기

### 테스트 방법
```bash
# 디버그 빌드로 확인
cd android
./gradlew assembleDebug

# 생성된 APK 위치
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔗 유용한 링크

- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- [Capacitor Assets 문서](https://github.com/ionic-team/capacitor-assets)
- [Android Splash Screen 가이드](https://developer.android.com/develop/ui/views/launch/splash-screen)
- [Material Design 아이콘 가이드](https://m3.material.io/styles/icons)

---

## ❓ 문제 해결

### Q: 아이콘이 변경되지 않아요
A: 앱을 완전히 삭제하고 재설치하세요. Android는 아이콘을 캐싱합니다.

### Q: 스플래시가 너무 빨리 사라져요
A: `styles.xml`에서 `windowSplashScreenAnimationDuration` 값을 늘리세요.

### Q: 다양한 해상도를 수동으로 만들기 힘들어요
A: `@capacitor/assets` 플러그인을 사용하면 자동으로 생성됩니다.
