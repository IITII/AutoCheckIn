#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import os
import sys
import time
from json.decoder import JSONDecodeError
from shutil import which

from selenium import webdriver


def get_exec_path():
    driver_name = 'chromedriver'
    path = which(driver_name)
    if path is None:
        path = which(driver_name, path='.')
        if path is None:
            print('No chrome driver...')
            sys.exit(1)
    return path


def get_driver():
    # Chrome options
    op = webdriver.ChromeOptions()
    # 关掉浏览器左上角的通知提示
    op.add_argument("--disable-notifications")
    # 关闭 chrome 正受到自动测试软件的控制'提示
    op.add_argument("disable-infobars")
    op.add_argument("--start-maximized")
    # No gui
    op.add_argument("--headless")
    # Run under root user
    op.add_argument("--no-sandbox")
    op.add_argument("--disable-dev-shm-usage")
    op.add_argument("--disable-gpu")

    # Modify User agent
    # op.add_argument(
    #     "user-agent='"
    #     "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) "
    #     "Chrome/84.0.4147.125 Mobile Safari/537.36'")

    driver = webdriver.Chrome(executable_path=get_exec_path(), options=op)
    return driver


def log(single, addition):
    info = "[{time_tag} 姓名：{yzxx} 学号: {loginName}] {add}"
    print(info.format(time_tag=time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
                      yzxx=single.__getitem__('yzxx'),
                      loginName=single.__getitem__('loginName'), add=addition)
          )


def task(driver, single):
    driver.get("https://fxgl.jx.edu.cn/4136010406/public/homeQd?loginName="
               + single.__getitem__('loginName')
               + "&loginType=" + str(single.__getitem__('loginType')))
    # 稍微等久一点，等待 js、css 加载
    time.sleep(5)
    log(single, '自动签到中...')
    js = 'async function(){let t=\'REPLACE\';return t=JSON.parse(t),await async function(t){return await new Promise(' \
         'n=>{$.ajax({url:"https://fxgl.jx.edu.cn/4136010406/studentQd/saveStu",method:"post",data:t,' \
         'success:function(t){return n(JSON.stringify(t))}})})}(t)}(); '
    js = js.replace("REPLACE", json.dumps(single.__getitem__('checkIn')))
    print(driver.execute_script('return ' + js))
    # time.sleep(3)
    # log(single, '自动填写问卷中...')
    # js = 'async function(){var t=\'REPLACE\',n="https://fxgl.jx.edu.cn/4136010406/";return 0==(t=JSON.parse(' \
    #      't)).sf?n+="dcwjEditNew/dcwjSubmit2":n+="dcwjEditNew/dcwjTsubmit2",await async function(t,n){return await ' \
    #      'new Promise(i=>{$.ajax({type:"post",url:t,data:{dcwj:JSON.stringify(n)},success:function(t){return i(' \
    #      'JSON.stringify(t))}})})}(n,t)}(); '
    # js = js.replace("REPLACE", json.dumps(single.__getitem__('paper')))
    # print(driver.execute_script('return ' + js))
    print()


def main():
    json_filename = "./config.json"
    try:
        with open(json_filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            driver = get_driver()
            success = 0
            fail = []
            index = -1
            for single in data:
                index += 1
                try:
                    task(driver, single)
                    time.sleep(1)
                    success += 1
                except Exception as e:
                    print(e)
                    fail += [index]
                    # Restart driver is too slow
                    driver.refresh()
                    driver = get_driver()
            driver.quit()
            # Error info
            if len(fail) == 0:
                for i in fail:
                    log(i, 'Error')
            print('Total: ' + str(len(data))
                  + '\nSuccess: ' + str(success)
                  + '\nFail: ' + str(len(fail)) + '\n')
    except FileNotFoundError:
        print("File is not found: " + os.path.abspath(json_filename))
        print("Creating file...")
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump([{
                "loginName": "student id",
                "yzxx": "name",
                "loginType": 0,
                "checkIn": {},
                "paper": {}
            }], f)
    except PermissionError:
        print("No permission: " + os.path.abspath(json_filename))
    except JSONDecodeError:
        print("Error file data...")


if __name__ == '__main__':
    main()
