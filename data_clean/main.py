# -*- coding: UTF-8 -*-
from flask import Flask, session, redirect, url_for, escape, request, render_template
import os
import sys
import time
from configparser import ConfigParser
import threading
import  pymysql
import  pymysql.cursors

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
    if request.form['file_time']:
        cf.set('file', 'expired', request.form['file_time'])
        cf.set('file', 'expired_unit', request.form['file_time_unit'])
    if request.form['msg_time']:
        cf.set('message', 'expired', request.form['msg_time'])
        cf.set('message', 'expired_unit', request.form['msg_time_unit'])
    if request.form['file_time'] or request.form['msg_time']:
        f = open(confFilePath ,'w')
        cf.write(f)
        f.close()
    return "配置成功"

def delDir(dir,t):
    files = os.listdir(dir)
    for file in files:
        filePath = dir + "/" + file
        if os.path.isfile(filePath):
            last = int(os.stat(filePath).st_mtime)
            now = int(time.time())
            if (now - last >= int(t)):
                os.remove(filePath)
                print(filePath + " was removed!")
        elif os.path.isdir(filePath):
            delDir(filePath,t)
            if not os.listdir(filePath):
                os.rmdir(filePath)
                print(filePath + " was removed!")

def delMsg(t):
    host = cf.get('mysql', 'host')
    user = cf.get('mysql', 'user')
    password = cf.get('mysql', 'password')
    db = cf.get('mysql', 'db')
    port = cf.get('mysql', 'port')
    charset = cf.get('mysql', 'charset')
    connection=pymysql.connect(host=host,
                           user=user,
                           password=password,
                           db=db,
                           port=int(port),
                           charset=charset)
    try:
        with connection.cursor() as cursor:
            sql='delete from message where now() - createTime >= %d' %t
            count=cursor.execute(sql)
            if count >= 1:
                print("删除消息数量： "+str(count))
            connection.commit()
    finally:
        connection.close()

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

def fileRun():
    while True:
        cf.read(confFilePath)
        times = cf.get('file', 'expired')
        unit = cf.get('file', 'expired_unit')
        if unit == "s":
            delDir(path, int(times))
        if unit == "m":
            delDir(path, int(times) * 60)
        if unit == "h":
            delDir(path, int(times) * 3600)
        if unit == "d":
            delDir(path, int(times) * 3600 * 24)
        time.sleep(6)
def msgRun():
    while True:
        cf.read(confFilePath)
        times = cf.get('message', 'expired')
        unit = cf.get('message', 'expired_unit')
        if unit == "s":
            delMsg(int(times))
        if unit == "m":
            delMsg(int(times) * 60)
        if unit == "h":
            delMsg(int(times) * 3600)
        if unit == "d":
            delMsg(int(times) * 3600 * 24)
        time.sleep(6)

if __name__ == '__main__':
    t1 = threading.Thread(target=app.run)
    t2 = threading.Thread(target=fileRun, args=())
    t3 = threading.Thread(target=msgRun, args=())

    t1.start()
    t2.start()
    t3.start()
