@echo off
chcp 65001 >nul
REM ============================================================================
REM  OBJAVI PROMJENE NA WEB STRANICU
REM  ---------------------------------------------------------------------------
REM  Dvoklik na ovu datoteku:
REM    1. prebaci promjene iz vozila.xlsx, proizvodi.xlsx i rabljena.xlsx u podatke stranice
REM    2. smanji nove slike
REM    3. posalje sve na GitHub -> Cloudflare za ~2 minute objavi novu verziju
REM ============================================================================

REM Uvijek radi u mapi u kojoj se nalazi ova datoteka (mapa projekta)
cd /d "%~dp0"

echo.
echo ===== 1/4  Preuzimam zadnju verziju s GitHuba =====
git pull --rebase --autostash
if errorlevel 1 goto greska

echo.
echo ===== 2/4  Prebacujem podatke iz Excela =====
if exist vozila.xlsx (
    py -X utf8 scripts\vozila_excel_to_json.py
    if errorlevel 1 goto greska
) else (
    echo vozila.xlsx ne postoji - preskacem.
)
if exist proizvodi.xlsx (
    py -X utf8 scripts\proizvodi_excel_to_json.py
    if errorlevel 1 goto greska
) else (
    echo proizvodi.xlsx ne postoji - preskacem.
)

REM rabljena.xlsx se napravi sam pri prvom pokretanju (prazan, s uputama)
py -X utf8 scripts\rabljena_excel_to_json.py
if errorlevel 1 goto greska

echo.
echo ===== 3/4  Smanjujem nove slike =====
py -X utf8 scripts\slike_smanji.py
if errorlevel 1 goto greska

echo.
echo ===== 4/4  Saljem na GitHub =====
git add .
git diff --cached --quiet
if not errorlevel 1 (
    echo.
    echo Nema promjena za objavu.
    goto kraj
)

set "PORUKA="
set /p PORUKA="Kratki opis promjene (npr. Nove cijene) i Enter: "
if "%PORUKA%"=="" set "PORUKA=Azurirani podaci"

git commit -m "%PORUKA%"
if errorlevel 1 goto greska
git push
if errorlevel 1 goto greska

echo.
echo ============================================================
echo  GOTOVO! Nova verzija bit ce online za otprilike 2 minute.
echo ============================================================
goto kraj

:greska
echo.
echo ============================================================
echo  GRESKA! Nesto nije proslo - procitaj poruku iznad.
echo  Excel mora biti spremljen i ZATVOREN prije pokretanja.
echo ============================================================

:kraj
echo.
pause
