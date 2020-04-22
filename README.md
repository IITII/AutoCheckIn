# AutoCheckIn
> 防疫签到的一些处理方法(JS version)  

1. 登录网站： [https://fxgl.jx.edu.cn/4136010406/](https://fxgl.jx.edu.cn/4136010406/)
2. `F12` 打开 `console`
3. 输入 `submit`
4. 双击查看代码
5. 在 `2683` 行打上断点，然后手动提交，卡住时终端输入 `console.log(JSON.stringify(param))`
6. 将输出的数据用来覆盖 `index.js` 里面的 `postVaule` 的值
7. 复制修改 `index.js` 的内容，回车运行看结果
8. 保存 `postVaule` 到本地，下次继续用