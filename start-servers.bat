@echo off
echo Starting Trip Itinerary Servers...

:: Start Backend Server
start powershell -NoExit -Command "cd backend; npm start"

:: Start Frontend Server
start powershell -NoExit -Command "cd frontend; npm start"

echo Servers are starting in separate windows...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000 