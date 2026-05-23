@echo off
title Katalist Launcher — Setup
color 0B
cls

echo.
echo  ██╗  ██╗ █████╗ ████████╗ █████╗ ██╗     ██╗███████╗████████╗
echo  ██║ ██╔╝██╔══██╗╚══██╔══╝██╔══██╗██║     ██║██╔════╝╚══██╔══╝
echo  █████╔╝ ███████║   ██║   ███████║██║     ██║███████╗   ██║
echo  ██╔═██╗ ██╔══██║   ██║   ██╔══██║██║     ██║╚════██║   ██║
echo  ██║  ██╗██║  ██║   ██║   ██║  ██║███████╗██║███████║   ██║
echo  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝╚══════╝   ╚═╝
echo.
echo  GAME LAUNCHER v1.0.0
echo  ─────────────────────────────────────────────────────────────
echo.

:: ── Check Node.js ────────────────────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js no encontrado.
    echo.
    echo  Necesitas instalar Node.js para continuar.
    echo  Descargalo en: https://nodejs.org
    echo.
    echo  Descargando pagina de Node.js en tu navegador...
    start https://nodejs.org/en/download
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo  [OK] Node.js %NODE_VERSION% detectado
echo.

:: ── Check npm ─────────────────────────────────────────────────────────────────
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] npm no encontrado. Reinstala Node.js desde nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo  [OK] npm v%NPM_VERSION% detectado
echo.

:: ── Install dependencies if needed ───────────────────────────────────────────
if not exist "node_modules\" (
    echo  [>>] Instalando dependencias... esto puede tardar 1-2 minutos.
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo  [ERROR] Fallo al instalar dependencias.
        echo  Intenta ejecutar manualmente: npm install
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Dependencias instaladas correctamente.
    echo.
) else (
    echo  [OK] Dependencias ya instaladas. Saltando npm install.
    echo.
)

:: ── Launch ────────────────────────────────────────────────────────────────────
echo  ─────────────────────────────────────────────────────────────
echo  [>>] Iniciando Katalist Launcher...
echo  ─────────────────────────────────────────────────────────────
echo.

npm run dev

:: Si el launcher se cierra con error, mostrar mensaje
if %errorlevel% neq 0 (
    echo.
    echo  [!] El launcher se cerro inesperadamente.
    pause
)
