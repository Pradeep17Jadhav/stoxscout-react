@echo off
setlocal enabledelayedexpansion

rem Set the path to the source folder
set "source_folder=src"

rem Set the name of the output file
set "output_file=content.js"
set "main_file=main.js"

rem Initialize the output file
type nul > %output_file%

rem Recursive function to merge JavaScript files excluding main.js
:merge_files
for /r "%source_folder%" %%F in (*.js) do (
    if /i not "%%~nxF"=="%main_file%" (
        set "file=%%~nxF"
        echo Merging "!file!"...
        echo. >> %output_file%
        type "%%F" >> %output_file%
    )
)

rem Add two empty lines before merging main.js
echo. >> %output_file%
echo. >> %output_file%

rem Merge main.js at the bottom of content.js
if exist "%source_folder%\%main_file%" (
    echo Merging "%main_file%" at the bottom...
    type "%source_folder%\%main_file%" >> %output_file%
)

rem End of script
echo All JavaScript files merged successfully.
exit /b