from selenium import webdriver
from win10toast import ToastNotifier
import time
import json


def toast(title, info):
    if title is not None:
        toaster.show_toast(title,
                           info,
                           icon_path="icon.png",
                           duration=10,
                           threaded=True)


toaster = ToastNotifier()
driver = webdriver.Chrome()
loginInfo = {
    "loginName": "学号",
    "yzxx": "姓名",
    "loginType": 0 #身份，默认为0，其他请详查网页代码
}
# try:
driver.get("https://fxgl.jx.edu.cn/4136010406/public/homeQd?loginName="
           + loginInfo.__getitem__('loginName')
           + "&loginType=" + str(loginInfo.__getitem__('loginType')))
time.sleep(1)
print("自动签到...")
driver.execute_script(open('./checkIn.js', encoding='utf-8').read())
time.sleep(2)
msg = driver.find_element_by_class_name('foot').get_attribute('msg')
print(msg)
msg = json.loads(msg)
toast("自动签到", msg['msg'])

print("调查问卷...")
driver.execute_script(open("./index.js", encoding='utf-8').read())
time.sleep(2)
msg1 = driver.find_element_by_class_name('foot').get_attribute('msg1')
msg1 = json.loads(msg1)
print(msg1)
toast("调查问卷", msg1['msg'])
print("10s 后自动退出...")
time.sleep(10)
driver.quit()
