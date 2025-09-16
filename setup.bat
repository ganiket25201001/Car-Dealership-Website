@echo off
echo Installing LeadFlow Pro dependencies...
echo.

cd /d "d:\git\SM\HSR Motors\leadflow-pro"

echo Installing npm dependencies...
npm install

echo.
echo Dependencies installed successfully!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
echo.
pause