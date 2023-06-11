import random
import json
import datetime
from time import time
from django.shortcuts import HttpResponse
from app01.models import user_info, article, chart
from app01.postMail import post

# 使用验证码登录
def login(request):
    user = request.body.decode('utf-8')
    new_dict = json.loads(user)
    phone = new_dict['phone']  # 通过json转化为字典类型，取值
    id_code = new_dict['id_code']
    objs = user_info.objects.filter(phone=phone, id_code=id_code).all()
    if (objs.count() != 0):
        obj = user_info.objects.filter(phone=phone, id_code=id_code).first().time
        if (time() - obj < 60.0):
            return HttpResponse("登录成功")
        else:
            return HttpResponse("验证码超时")
    return HttpResponse("验证码错误")

# 发送验证码
def getCode(request):
    phone = request.body.decode('utf-8')
    id_code = random.randint(100000, 999999)  # 生成六位随机验证码
    state = post(phone,str(id_code))
    objs = user_info.objects.filter(phone=str(phone)).all()
    if (objs.count() == 0):
        user_info.objects.create(phone=str(phone), id_code=id_code, time=time())
    else:
        user_info.objects.filter(phone=str(phone)).update(id_code=id_code, time=time())
    return HttpResponse(state)

# 根据密码登录
def passwordLogin(request):
    user = request.body.decode('utf-8')
    new_dict = json.loads(user)
    phone = new_dict['phone']  # 通过json转化为字典类型，取值
    password = new_dict['password']
    if (user_info.objects.filter(phone=phone, password=password).all().count() != 0):
        return HttpResponse("登录成功")
    if (user_info.objects.filter(mail=phone, password=password).all().count() != 0):
        return HttpResponse("登录成功")
    if (user_info.objects.filter(name=phone, password=password).all().count() != 0):
        return HttpResponse("登录成功")
    return HttpResponse("密码错误")

# 获取个人信息
def getUserInfo(request):
    phone = request.body.decode('utf-8')  # 将封装好的querydict类型拆开成dict在拆成list取值
    info = user_info.objects.filter(phone=phone).first()  # 从数据库中取值
    info_dict = vars(info)  # 将取出的对象转换为字典
    info_dict.pop("_state")  # 将字典类中的奇怪玩意删了，否则无法序列化为字符串
    str = json.dumps(info_dict)  # 序列化为字符串
    return HttpResponse(str)

# 修改个人信息
def changeInfo(request):
    user = request.body.decode('utf-8')
    new_dict = json.loads(user)
    phone = new_dict['phone']  # 通过json转化为字典类型，取值
    info = user_info.objects.filter(phone=phone).first()  # 从数据库中取值
    info_dict = vars(info)  # 将取出的队列字典转换为字典
    info_dict.pop("_state")  # 将字典类中的奇怪玩意删了，否则无法序列化为字符串
    for key in new_dict:
        if new_dict[key] != info_dict[key]:
            if key == 'name':
                objs = user_info.objects.filter(name=new_dict['name']).all()
                if objs.count() == 0:
                    user_info.objects.filter(phone=phone).update(name=new_dict['name'])
                else:
                    return HttpResponse('用户名已存在，修改失败')
            elif key == 'mail':
                objs = user_info.objects.filter(mail=new_dict['mail']).all()
                if objs.count() == 0:
                    user_info.objects.filter(phone=phone).update(mail=new_dict['mail'])
                else:
                    return HttpResponse('邮箱已存在，修改失败')
            else:
                user_info.objects.filter(phone=phone).update(sex=new_dict['sex'], position=new_dict['position'],
                                                             password=new_dict['password'], unit=new_dict['unit'],
                                                             head_img=new_dict['head_img'])
    return HttpResponse('修改成功')

# 存入文章
def art(request):
    now = datetime.datetime.now()
    date = now.strftime("%Y-%m-%d %H:%M:%S")
    art = request.body.decode('utf-8')
    new_dict = json.loads(art)
    id = new_dict['id']
    if id == 0:
        article.objects.create(phone=new_dict['phone'], txt=new_dict['txt'], title=new_dict['title'],
                               type=new_dict['type'], date=date)
        art = article.objects.filter(date=date).first()
        return HttpResponse(art.id)
    else:
        article.objects.filter(id=id).update(txt=new_dict['txt'], title=new_dict['title'], date=date)
        art = article.objects.filter(date=date).first()
        return HttpResponse(art.id)

# 获取所有同公司文章的大致信息
def artlist(request):
    unit = request.body.decode('utf-8')
    articles = list(article.objects.all().values('title', 'phone', 'id', 'date', 'type'))
    for i in articles:
        if user_info.objects.filter(phone=i['phone']).first().unit != unit:
            articles.remove(i)
            continue
        if i['type'] != 0:
            i['txt'] = article.objects.filter(id=i['id']).first().txt
        i['head_img'] = user_info.objects.filter(phone=i['phone']).first().head_img
    return HttpResponse(json.dumps(articles))

# 根据id获取指定文章
def getart(request):
    id = request.body.decode('utf-8')  # 将封装好的querydict类型拆开成dict在拆成list取值
    if id == '':
        return HttpResponse('')
    info = article.objects.filter(id=id).first()  # 从数据库中取值
    info_dict = vars(info)  # 将取出的对象转换为字典
    info_dict.pop("_state")  # 将字典类中的奇怪玩意删了，否则无法序列化为字符串
    str = json.dumps(info_dict)  # 序列化为字符串
    return HttpResponse(str)

# 存入图表
def chat(request):
    now = datetime.datetime.now()
    date = now.strftime("%Y-%m-%d %H:%M:%S")
    ch = request.body.decode('utf-8')
    new_dict = json.loads(ch)
    id = new_dict['id']
    if id == 0:
        chart.objects.create(phone=new_dict['phone'], value=new_dict['value'], title=new_dict['title'],
                             type=new_dict['type'], date=date)
        ch = chart.objects.filter(date=date).first()
        return HttpResponse(ch.id)
    else:
        chart.objects.filter(id=id).update(value=new_dict['value'], title=new_dict['title'], date=date)
        ch = chart.objects.filter(date=date).first()
        return HttpResponse(ch.id)

# 获取所有同公司文章的大致信息
def chatlist(request):
    unit = request.body.decode('utf-8')
    charts = list(chart.objects.all().values('title', 'phone', 'id', 'date'))
    for i in charts:
        if user_info.objects.filter(phone=i['phone']).first().unit != unit:
            charts.remove(i)
            continue
        i['head_img'] = user_info.objects.filter(phone=i['phone']).first().head_img
    return HttpResponse(json.dumps(charts))

def getchat(request):
    id = request.body.decode('utf-8')  # 将封装好的querydict类型拆开成dict在拆成list取值
    if id == '':
        return HttpResponse('')
    info = chart.objects.filter(id=id).first()  # 从数据库中取值
    info_dict = vars(info)  # 将取出的对象转换为字典
    info_dict.pop("_state")  # 将字典类中的奇怪玩意删了，否则无法序列化为字符串
    str = json.dumps(info_dict)  # 序列化为字符串
    return HttpResponse(str)

def deletechart(request):
    id = request.body.decode('utf-8')  # 将封装好的querydict类型拆开成dict在拆成list取值
    if id == '':
        return HttpResponse('图表不存在')
    chart.objects.filter(id=id).delete()
    return HttpResponse('删除成功')

def deletearticle(request):
    id = request.body.decode('utf-8')  # 将封装好的querydict类型拆开成dict在拆成list取值
    if id == '':
        return HttpResponse('文章不存在')
    article.objects.filter(id=id).delete()
    return HttpResponse('删除成功')

def myartlist(request):
    phone = request.body.decode('utf-8')
    charts = list(article.objects.filter(phone=phone).values('title', 'phone', 'id', 'date','type'))
    img = user_info.objects.filter(phone=phone).first().head_img
    for i in charts:
        i['head_img'] = img
    return HttpResponse(json.dumps(charts))

def mychatlist(request):
    phone = request.body.decode('utf-8')
    charts = list(chart.objects.filter(phone=phone).values('title', 'phone', 'id', 'date', 'type'))
    img = user_info.objects.filter(phone=phone).first().head_img
    for i in charts:
        i['head_img'] = img
    return HttpResponse(json.dumps(charts))