# 📱 STREAMIX Android App 빌드 가이드

## 🎯 빠른 시작

### 현재 상태
- ✅ Next.js 정적 빌드 설정 완료
- ✅ Capacitor Android 통합 완료
- ✅ Android Studio 프로젝트 생성됨
- ⚠️ Java 17 설치 필요 (현재: Java 11)

---

## 📋 요구사항

### 필수 설치 항목
- [x] Node.js (설치됨)
- [x] pnpm (설치됨)
- [x] Android Studio (설치됨)
- [ ] **Java 17** (설치 필요 - 현재 Java 11)
- [ ] Android SDK (Android Studio 포함)

---

## ⚡ 빠른 빌드

### 1️⃣ Java 17 설치
```bash
# 상세 가이드 참조
cat JAVA_17_SETUP_GUIDE.md
```

### 2️⃣ APK 빌드 (자동화 스크립트)
```powershell
# PowerShell에서 실행
./build-apk.ps1
```

### 3️⃣ 수동 빌드
```bash
# Next.js 빌드
npm run build

# Capacitor 동기화
npx cap sync android

# APK 빌드
cd android
./gradlew assembleDebug

# APK 위치
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎨 앱 커스터마이징

### 앱 아이콘 & 스플래시 화면 교체
```bash
# 상세 가이드 참조
cat ANDROID_ASSETS_GUIDE.md
```

**요약:**
1. 프로젝트 루트에 `icon.png` (1024×1024) 생성
2. 프로젝트 루트에 `splash.png` (2732×2732) 생성
3. Capacitor Assets 설치:
   ```bash
   npm install @capacitor/assets --save-dev
   ```
4. 자동 생성:
   ```bash
   npx capacitor-assets generate --android
   ```

---

## 🔧 개발 환경

### Android Studio에서 열기
```bash
npx cap open android
```

### 실시간 개발
```bash
# 터미널 1: Next.js 개발 서버
npm run dev

# 터미널 2: Capacitor Live Reload
npx cap run android -l --external
```

---

## 📦 릴리스 빌드

### 1. 서명 키 생성
```bash
# Android 폴더에서 실행
keytool -genkey -v -keystore streamix-release-key.keystore -alias streamix -keyalg RSA -keysize 2048 -validity 10000
```

### 2. gradle.properties 설정
`android/gradle.properties`에 추가:
```properties
STREAMIX_RELEASE_STORE_FILE=streamix-release-key.keystore
STREAMIX_RELEASE_KEY_ALIAS=streamix
STREAMIX_RELEASE_STORE_PASSWORD=your_password
STREAMIX_RELEASE_KEY_PASSWORD=your_password
```

### 3. app/build.gradle 설정
```gradle
android {
    signingConfigs {
        release {
            storeFile file(STREAMIX_RELEASE_STORE_FILE)
            storePassword STREAMIX_RELEASE_STORE_PASSWORD
            keyAlias STREAMIX_RELEASE_KEY_ALIAS
            keyPassword STREAMIX_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4. Release APK 빌드
```bash
cd android
./gradlew assembleRelease

# 생성 위치:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🐛 문제 해결

### Java 버전 오류
```
Error: Android Gradle plugin requires Java 17
```
**해결:** `JAVA_17_SETUP_GUIDE.md` 참조

### 빌드 실패 시
```bash
# 캐시 삭제
cd android
./gradlew clean

# Node modules 재설치
cd ..
rm -rf node_modules
pnpm install

# 다시 빌드
./build-apk.ps1
```

### 앱 실행 시 흰 화면
```bash
# Next.js 빌드 확인
npm run build

# Capacitor 동기화
npx cap sync android

# Android Studio에서 "Invalidate Caches and Restart"
```

---

## 📱 앱 정보

- **앱 이름**: STREAMIX
- **패키지명**: com.ledlaputa.streamix
- **버전**: 1.0
- **최소 SDK**: 24 (Android 7.0)
- **타겟 SDK**: 36 (Android 14+)

---

## 📚 유용한 명령어

```bash
# Android 기기 연결 확인
adb devices

# APK 설치
adb install android/app/build/outputs/apk/debug/app-debug.apk

# 앱 실행
adb shell am start -n com.ledlaputa.streamix/.MainActivity

# 로그 보기
adb logcat | grep -i streamix

# APK 제거
adb uninstall com.ledlaputa.streamix
```

---

## 🚀 배포

### Google Play Store
1. Release APK 빌드
2. Google Play Console에서 앱 등록
3. 스토어 리스팅 정보 입력
4. APK 업로드 및 심사 제출

### 직접 배포
1. Release APK를 웹사이트에 호스팅
2. QR 코드 생성하여 공유
3. 사용자는 "알 수 없는 소스" 허용 후 설치

---

## 📞 지원

문제가 발생하면:
1. `JAVA_17_SETUP_GUIDE.md` 확인
2. `ANDROID_ASSETS_GUIDE.md` 확인
3. Android Studio Build Output 확인
4. `adb logcat` 로그 확인

---

## 🎉 완료!

이제 STREAMIX 앱을 Android 기기에서 실행할 수 있습니다! 🎬📱
