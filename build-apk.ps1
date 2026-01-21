# STREAMIX Android APK 빌드 스크립트
# PowerShell 스크립트

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  STREAMIX Android APK 빌드" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Java 버전 확인
Write-Host "[1/5] Java 버전 확인 중..." -ForegroundColor Yellow
$javaVersion = java -version 2>&1 | Select-String "version"
Write-Host "  → $javaVersion" -ForegroundColor Gray

if ($javaVersion -match "11\.") {
    Write-Host "  ⚠️  경고: Java 11 감지됨. Java 17 권장" -ForegroundColor Red
    Write-Host "  📖 가이드: JAVA_17_SETUP_GUIDE.md 참조" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "계속하시겠습니까? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Next.js 정적 빌드
Write-Host ""
Write-Host "[2/5] Next.js 정적 사이트 빌드 중..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Next.js 빌드 실패" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Next.js 빌드 완료" -ForegroundColor Green

# Capacitor 동기화
Write-Host ""
Write-Host "[3/5] Capacitor Android 동기화 중..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Capacitor 동기화 실패" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Capacitor 동기화 완료" -ForegroundColor Green

# Gradle 클린
Write-Host ""
Write-Host "[4/5] Gradle 프로젝트 클린 중..." -ForegroundColor Yellow
Push-Location android
./gradlew clean
Pop-Location
Write-Host "  ✅ 클린 완료" -ForegroundColor Green

# Android APK 빌드
Write-Host ""
Write-Host "[5/5] Android Debug APK 빌드 중..." -ForegroundColor Yellow
Write-Host "  (첫 빌드는 시간이 걸릴 수 있습니다...)" -ForegroundColor Gray
Push-Location android
./gradlew assembleDebug
$buildResult = $LASTEXITCODE
Pop-Location

if ($buildResult -ne 0) {
    Write-Host ""
    Write-Host "  ❌ APK 빌드 실패" -ForegroundColor Red
    Write-Host ""
    Write-Host "  🔧 해결 방법:" -ForegroundColor Yellow
    Write-Host "     1. Java 17 설치 확인 (JAVA_17_SETUP_GUIDE.md)" -ForegroundColor Gray
    Write-Host "     2. Android Studio가 열려있다면 닫기" -ForegroundColor Gray
    Write-Host "     3. 터미널 재시작 후 다시 시도" -ForegroundColor Gray
    exit 1
}

# 성공!
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  ✅ APK 빌드 성공!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 APK 파일 위치:" -ForegroundColor Cyan
Write-Host "   android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""

# APK 파일 정보
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $apkInfo = Get-Item $apkPath
    $sizeInMB = [math]::Round($apkInfo.Length / 1MB, 2)
    Write-Host "📊 APK 정보:" -ForegroundColor Cyan
    Write-Host "   크기: $sizeInMB MB" -ForegroundColor White
    Write-Host "   생성 시간: $($apkInfo.LastWriteTime)" -ForegroundColor White
}

Write-Host ""
Write-Host "🚀 다음 단계:" -ForegroundColor Cyan
Write-Host "   1. USB 디버깅으로 설치:" -ForegroundColor Gray
Write-Host "      adb install $apkPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2. 또는 APK 파일을 기기로 전송하여 설치" -ForegroundColor Gray
Write-Host ""
Write-Host "📱 Android Studio에서 실행:" -ForegroundColor Cyan
Write-Host "   npx cap open android" -ForegroundColor Yellow
Write-Host ""
