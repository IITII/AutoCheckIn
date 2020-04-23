# AutoCheckIn
> 防疫签到的一些处理方法(Python version)  

1. 登录网站： [https://fxgl.jx.edu.cn/4136010406/](https://fxgl.jx.edu.cn/4136010406/)
2. `F12` 打开 `console`
3. 进入每日签到界面
4. `console` 输入 `submits` 定位代码打上断点，进行一次提交，卡住时终端输入 `console.log(JSON.stringify(param))`
5. 将输出的数据用来覆盖 `checkIn.js` 里面的 `postVaule` 的值
6. 进入问卷调查界面
7. `console` 输入 `submit`
8. 双击查看代码
9. 在 `2683` 行打上断点，然后手动提交，卡住时终端输入 `console.log(JSON.stringify(param))`
10. 将输出的数据用来覆盖 `index.js` 里面的 `postVaule` 的值
11. 修改 `index.py`  里面的 `loginInfo` 参数
12. Copy `chromedriver.exe` to PATH
13. Run: `pip install -r requirements.txt`
14. Run: `python index.py`
15. 提交测试通过以后，可以选择 **添加Windows定时任务**，并且执行后可以选择保留窗口，方便查错。


### 一些注意事项
1. 因为本项目使用了 `Windows10` 原生通知，所以可能在一些系统里面不会正常显示通知
2. 目前只支持 `Chrome` ,暂时没有支持其他浏览器的计划