@echo off
chcp 65001 >nul
REM ============================================================================
REM  POKRENI STRANICU NA OVOM RACUNALU (za pregled prije objave)
REM  ---------------------------------------------------------------------------
REM  Otvori http://localhost:3000 u pregledniku. Za gasenje zatvori ovaj prozor.
REM ============================================================================

cd /d "%~dp0"

REM Ako paketi jos nisu instalirani, instaliraj ih (samo prvi put)
if not exist node_modules (
    echo Prvo pokretanje - instaliram pakete, pricekaj minutu-dvije...
    call npm install
)

REM Otvori preglednik nakon par sekundi (dok se stranica pokrene)
start "" cmd /c "timeout /t 8 >nul & start http://localhost:3000"

echo Stranica se pokrece... Za gasenje zatvori ovaj prozor.
call npm run dev
