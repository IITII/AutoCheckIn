from selenium import webdriver
from win10toast import ToastNotifier
import time
import json


def toast(title, info):
    if title is not None:
        toaster.show_toast(title,
                           info,
                           icon_path="icon.ico",
                           duration=3,
                           threaded=True)


def task(code):
    if code is None:
        print('code could not be None...')
        return
    if code == 0:
        info = {
            "filename": "./checkIn.js",
            "tip": "自动签到",
            "msg": "msg"
        }
    elif code == 1:
        info = {
            "filename": "./index.js",
            "tip": "调查问卷",
            "msg": "msg1"
        }
    else:
        print('No such code')
        return
    driver.execute_script(open(info.get("filename"), encoding='utf-8').read())
    time.sleep(2)
    msg = driver.find_element_by_class_name('foot').get_attribute(info.get("msg"))
    print(msg)
    msg = json.loads(msg)
    toast(info.get("tip"), msg.get('msg'))


toaster = ToastNotifier()
driver = webdriver.Chrome()
loginInfo = {
    "loginName": "学号",
    "yzxx": "姓名",
    "loginType": 0  # 身份，默认为0，其他请详查网页代码
}
# try:
driver.get("https://fxgl.jx.edu.cn/4136010406/public/homeQd?loginName="
           + loginInfo.__getitem__('loginName')
           + "&loginType=" + str(loginInfo.__getitem__('loginType')))
time.sleep(1)
task(0)
time.sleep(3)
task(1)
print("10s 后关闭浏览器...")
time.sleep(10)
print("浏览器已关闭")
driver.quit()
