import hashlib
import urllib.request
import urllib

def md5(str):
    m = hashlib.md5()
    m.update(str.encode("utf8"))
    return m.hexdigest()

def post(phone,id_code):#封装好的发送邮件函数
    statusStr = {       #状态对应表
        '0': '验证码发送成功',
        '-1': '参数不全',
        '-2': '服务器空间不支持,请确认支持curl或者fsocket,联系您的空间商解决或者更换空间',
        '30': '密码错误',
        '40': '账号不存在',
        '41': '余额不足',
        '42': '账户已过期',
        '43': 'IP地址限制',
        '50': '内容含有敏感词'
    }

    smsapi = "http://api.smsbao.com/"
    # 短信平台账号
    user = 'Chenyiax'
    # 短信平台密码
    password = md5('like20010410')
    # 要发送的短信内容
    content = '【数据表】您的验证码为：' + id_code + '，60秒内有效.若非本人操作请忽略此消息。'
    # 要发送短信的手机号码

    data = urllib.parse.urlencode({'u': user, 'p': password, 'm': phone, 'c': content})
    send_url = smsapi + 'sms?' + data
    response = urllib.request.urlopen(send_url)
    the_page = response.read().decode('utf-8')
    print(statusStr[the_page])
    return statusStr[the_page]

