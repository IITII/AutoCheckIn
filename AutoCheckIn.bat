rem AutoCheckIn
setlocal EnableDelayedExpansion
cd %~dp0
python ./App.py
echo "若想使本页面自动关闭的话，编辑 AutoCheckIn.bat 文件，删除或注释 pause 即可"
pause