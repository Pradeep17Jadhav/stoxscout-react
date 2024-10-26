@echo off
xcopy /E /I /Y ".\data" ".\extension\src\data"
xcopy /E /I /Y ".\data" ".\src\data"
xcopy /E /I /Y ".\data" ".\server\data"