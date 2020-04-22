from selenium import webdriver
from win10toast import ToastNotifier
import time

toaster = ToastNotifier()
driver = webdriver.Chrome()
loginInfo = {
    "loginName": "学号",
    "yzxx": "姓名",
    "loginType": 0
}
# try:
driver.get("https://fxgl.jx.edu.cn/4136010406/public/homeQd?loginName="
           + loginInfo.__getitem__('loginName')
           + "&loginType=" + str(loginInfo.__getitem__('loginType')))
time.sleep(1)
driver.execute_script("qdxqy()")
time.sleep(1)
if driver.find_element_by_class_name("Sign-in-succeed") is not None:
    driver.get("https://fxgl.jx.edu.cn/4136010406/public/qdwcIndex")
time.sleep(1)
driver.execute_script(open("./index.js", encoding='utf-8').read())
time.sleep(2)
msg1 = driver.find_element_by_class_name('foot').get_attribute('msg1')
print(msg1)
if msg1 is not None:
    toaster.show_toast("防疫签到",
                       msg1,
                       icon_path="icon.png",
                       duration=10,
                       threaded=True)
# time.sleep(1)

# except Exception:
#     print("Failed")
time.sleep(30)
driver.quit()
