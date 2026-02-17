@echo off
setlocal ENABLEDELAYEDEXPANSION

rem ============================================
rem  Pengaturan dasar
rem ============================================
set "GIT_REMOTE_URL=https://github.com/dewecorp/dashboard.git"

rem Jalankan dari folder tempat file .bat ini berada
cd /d "%~dp0"

echo.
echo =====================================================
echo   Git commit, push ke GitHub, dan ZIP backup dashboard
echo =====================================================
echo.

rem ============================================
rem  Cek ketersediaan git
rem ============================================
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Git tidak terdeteksi di PATH.
    echo Pastikan Git sudah terinstall dan bisa dipanggil dari Command Prompt.
    echo.
    pause
    goto :END
)

rem ============================================
rem  Pastikan folder ini adalah repo git
rem ============================================
if not exist ".git" (
    echo.
    echo Repo git belum ada - folder .git tidak ditemukan.
    echo Membuat repo git baru dan menghubungkan ke:
    echo   %GIT_REMOTE_URL%
    git init
    git branch -M main
    git remote add origin "%GIT_REMOTE_URL%"
) else (
    git remote get-url origin >nul 2>&1
    if errorlevel 1 (
        echo.
        echo Remote "origin" belum dikonfigurasi. Menambahkan:
        echo   %GIT_REMOTE_URL%
        git remote add origin "%GIT_REMOTE_URL%"
    )
)

echo.
echo Status git saat ini:
git status
echo.

rem ============================================
rem  Input dan konfirmasi pesan commit
rem ============================================
set "COMMIT_MSG="
set /p COMMIT_MSG="Masukkan pesan commit: "

if "%COMMIT_MSG%"=="" (
    echo.
    echo Pesan commit tidak boleh kosong. Proses dibatalkan.
    echo.
    pause
    goto :END
)

echo.
echo Pesan commit yang akan digunakan:
echo   "%COMMIT_MSG%"
echo.
set "CONFIRM="
set /p CONFIRM="Lanjutkan dengan pesan ini? (Y/N): "

if /I not "%CONFIRM%"=="Y" (
    echo.
    echo Proses dibatalkan oleh pengguna.
    echo.
    pause
    goto :END
)

rem ============================================
rem  git add dan git commit
rem ============================================
echo.
echo === Menjalankan git add ===
git add -A

echo.
echo === Menjalankan git commit ===
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo.
    echo Commit gagal (mungkin tidak ada perubahan baru).
    set "CONFIRM_NO_COMMIT="
    set /p CONFIRM_NO_COMMIT="Lanjutkan git push dan backup ZIP tanpa commit baru? (Y/N): "
    if /I not "%CONFIRM_NO_COMMIT%"=="Y" (
        echo.
        echo Proses dibatalkan karena commit gagal dan tidak dilanjutkan.
        echo.
        pause
        goto :END
    )
)

rem ============================================
rem  git push
rem ============================================
echo.
echo === Menjalankan git push ke remote tracking default ===
git push
if errorlevel 1 (
    echo.
    echo Peringatan: git push gagal. Periksa konfigurasi remote atau koneksi internet.
)

rem ============================================
rem  ZIP backup (overwrite)
rem ============================================
echo.
echo === Membuat ZIP backup (menimpa jika sudah ada) ===
echo File: dashboard-backup.zip

powershell -NoLogo -NonInteractive -Command "Get-ChildItem -Path . -Recurse -File -Exclude 'dashboard-backup.zip','.gitignore','dashboard-backup.bat','git-commit-push-backup.bat' | Compress-Archive -DestinationPath 'dashboard-backup.zip' -Force" 2>nul
if errorlevel 1 (
    echo.
    echo Peringatan: Gagal membuat ZIP backup. Periksa apakah PowerShell dan Compress-Archive tersedia.
) else (
    echo.
    echo Backup ZIP berhasil dibuat / diperbarui.
)

echo.
echo Selesai. Tekan sembarang tombol untuk menutup jendela ini.
echo.
pause

:END
endlocal
