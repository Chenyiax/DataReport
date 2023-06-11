from django.db import models

class user_info(models.Model):
    name = models.CharField(max_length=20)
    sex = models.CharField(max_length=20)
    head_img = models.TextField(default='')
    mail = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    unit = models.CharField(max_length=20)
    position = models.CharField(max_length=20)
    id_code = models.IntegerField(default=0)
    phone = models.CharField(max_length=20)
    time = models.FloatField(default=0)

class article(models.Model):
    phone = models.CharField(max_length=20)
    date = models.CharField(max_length=20)
    txt = models.TextField(default='')
    title = models.CharField(max_length=100,default='')
    type = models.IntegerField(default=0)

class chart(models.Model):
    phone = models.CharField(max_length=20)
    date = models.CharField(max_length=20)
    value = models.TextField(default='')
    title = models.CharField(max_length=100,default='')
    type = models.IntegerField(default=0)