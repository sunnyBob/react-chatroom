# -*- coding: UTF-8 -*-
from flask import Flask, session, redirect, url_for, escape, request, render_template
import os
import sys
import time
from configparser import ConfigParser
import threading

cf = ConfigParser()
path = '../server/upload'
confFilePath = r'D:\jobs\chatroom\data_clean\conf\clean.conf'

app = Flask(__name__)

@app.route('/')
def index():
    if 'username' in session:
        return render_template('index.html')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'root' and request.form['password'] == '123456':
            session['username'] = request.form['username']
            return redirect(url_for('index'))
    return render_template('login.html', title='管理员登录')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/clean', methods=['POST'])
def clean():
    print(request.form)
    cf.set('clean', 'expired', request.form['file_time'])
    cf.set('clean', 'expired_unit', request.form['file_time_unit'])
    f = open(confFilePath ,'w')
    cf.write(f)
    f.close()
    return '应用成功'

def delDir(dir,t):
    files = os.listdir(dir)
    for file in files:
        filePath = dir + "/" + file
        if os.path.isfile(filePath):
            last = int(os.stat(filePath).st_mtime)
            now = int(time.time())
            print()
            if (now - last >= t):
                os.remove(filePath)
                print(filePath + " was removed!")
        elif os.path.isdir(filePath):
            delDir(filePath,t)
            if not os.listdir(filePath):
                os.rmdir(filePath)
                print(filePath + " was removed!")

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

def circleRun():
    while True:
        cf.read(confFilePath)
        times = cf.get('clean', 'expired')
        unit = cf.get('clean', 'expired_unit')
        print(times)
        if unit == 's':
            delDir(path, times)
        if unit == 'm':
            delDir(path, times * 60)
        if unit == 'h':
            delDir(path, times * 3600)
        if unit == 'd':
            delDir(path, times * 3600 * 24)
        time.sleep(60)

if __name__ == '__main__':
    t1 = threading.Thread(target=circleRun, args=())
    t2 = threading.Thread(target=app.run, args=())
    t1.start()
    t2.start()
