# ☕ Java 17 설치 가이드

## 🔍 현재 상황

- **현재 Java 버전**: Java 11
- **필요한 버전**: Java 17 이상
- **이유**: Capacitor 8.x와 Android Gradle Plugin 8.x는 Java 17 필요

---

## 📥 Java 17 설치 방법

### 방법 1: Microsoft Build of OpenJDK 17 (권장)

#### 1. 다운로드
https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17

또는 직접 링크:
- Windows x64: https://aka.ms/download-jdk/microsoft-jdk-17-windows-x64.msi

#### 2. 설치
1. 다운로드한 MSI 파일 실행
2. 설치 마법사 따라가기
3. 기본 설치 경로: `C:\Program Files\Microsoft\jdk-17.x.x`

#### 3. 환경 변수 설정

**자동 설정 (PowerShell 관리자 권한):**
```powershell
# JAVA_HOME 설정
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Microsoft\jdk-17.x.x", "Machine")

# Path에 추가
$path = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$newPath = "$path;%JAVA_HOME%\bin"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "Machine")
```

**수동 설정:**
1. `Win + X` → "시스템"
2. "고급 시스템 설정"
3. "환경 변수" 클릭
4. 시스템 변수에서:
   - 새로 만들기: `JAVA_HOME` = `C:\Program Files\Microsoft\jdk-17.x.x`
   - `Path` 편집 → 추가: `%JAVA_HOME%\bin`

#### 4. 확인
```bash
# 터미널 재시작 후
java -version

# 출력 예시:
# openjdk version "17.0.xx" 2024-xx-xx LTS
# OpenJDK Runtime Environment Microsoft-xxxxx (build 17.0.xx+xx-LTS)
```

---

### 방법 2: Oracle JDK 17

#### 1. 다운로드
https://www.oracle.com/java/technologies/downloads/#java17

#### 2. 설치 및 환경 변수 설정
- 위의 "Microsoft OpenJDK" 방법과 동일
- 기본 경로: `C:\Program Files\Java\jdk-17`

---

## 🔧 Gradle 프로젝트에 Java 17 적용

### gradle.properties 수정

`android/gradle.properties` 파일에 추가:

```properties
# Java 17 경로 명시
org.gradle.java.home=C:\\Program Files\\Microsoft\\jdk-17.0.xx
```

또는 Java 11로 임시 사용 (권장하지 않음):
```properties
org.gradle.java.home=C:\\Program Files\\Microsoft\\jdk-11.0.16.101-hotspot
```

---

## ✅ 설치 후 APK 빌드

Java 17 설치 및 환경 변수 설정 완료 후:

```bash
# 1. 터미널 완전히 재시작

# 2. Java 버전 확인
java -version

# 3. Android 프로젝트로 이동
cd android

# 4. 디버그 APK 빌드
./gradlew assembleDebug

# 5. Release APK 빌드 (선택)
./gradlew assembleRelease
```

---

## 📦 빌드된 APK 위치

### Debug APK
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 🚀 APK 빌드 자동화 스크립트

프로젝트 루트에 `build-apk.ps1` 생성:

```powershell
# build-apk.ps1
Write-Host "=== STREAMIX Android APK 빌드 ===" -ForegroundColor Cyan

# Next.js 빌드
Write-Host "`n1. Next.js 정적 빌드 중..." -ForegroundColor Yellow
npm run build

# Capacitor 동기화
Write-Host "`n2. Capacitor 동기화 중..." -ForegroundColor Yellow
npx cap sync android

# Gradle 빌드
Write-Host "`n3. Android APK 빌드 중..." -ForegroundColor Yellow
cd android
./gradlew clean assembleDebug

# 결과 출력
Write-Host "`n=== 빌드 완료! ===" -ForegroundColor Green
Write-Host "APK 위치: android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor Green
```

실행:
```bash
./build-apk.ps1
```

---

## 📱 APK 설치 및 테스트

### 방법 1: USB 디버깅

1. Android 기기 USB 연결
2. 개발자 옵션에서 "USB 디버깅" 활성화
3. 명령어 실행:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 방법 2: 직접 설치

1. APK 파일을 기기로 전송 (이메일, 클라우드 등)
2. 기기에서 APK 파일 탭하여 설치
3. "알 수 없는 소스" 허용 필요

---

## ❌ 문제 해결

### Q: "Android Gradle plugin requires Java 17" 에러
**A**: Java 17 설치 후 터미널을 완전히 재시작하세요.

### Q: JAVA_HOME이 설정되지 않아요
**A**: 
```bash
# 현재 JAVA_HOME 확인
echo $env:JAVA_HOME

# 없다면 설정 (관리자 권한)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Microsoft\jdk-17.x.x", "Machine")
```

### Q: gradlew 실행 시 권한 에러
**A**:
```bash
# PowerShell 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q: 빌드는 되는데 앱이 실행되지 않아요
**A**:
1. `npm run build` 다시 실행
2. `npx cap sync android` 다시 실행
3. Android Studio에서 "Clean Project" 실행

---

## 🔗 참고 링크

- [Microsoft OpenJDK 다운로드](https://learn.microsoft.com/en-us/java/openjdk/download)
- [Android 개발자 가이드](https://developer.android.com/studio/intro)
- [Capacitor 문서](https://capacitorjs.com/docs/android)
- [Gradle 공식 문서](https://gradle.org/install/)

---

## 📝 체크리스트

설치 후 확인사항:

- [ ] Java 17 설치 완료
- [ ] `java -version`에서 17.x 확인
- [ ] JAVA_HOME 환경 변수 설정
- [ ] Path에 Java bin 경로 추가
- [ ] 터미널 재시작
- [ ] `./gradlew assembleDebug` 성공
- [ ] APK 파일 생성 확인

모든 체크가 완료되면 안드로이드 앱 빌드 준비 완료! 🎉
