import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Button, Divider, Radio, Input, message, Upload, Modal, Layout} from 'antd';
import './Information.css'
import {EditOutlined, LeftOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import url from "../../url";
import {MyContext} from "../../App"
import {RadioChangeEvent} from "antd";
import {useHistory} from "react-router-dom";
import HeaderNavigation from "../../components/HeaderNavigation/HeaderNavigation";

const UserProfile = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const {userInfo,setUserInfo} = useContext(MyContext);
    const [changeButton,setChangeButton] = useState('');
    const [sex,setSex] = useState('');
    const [isModal, setIsModal] = useState(false);//用于唤起弹窗
    const history = useHistory();
    const [deviceWidth , setDevieWidth] = useState(false);
    function handleResize() {
        setDevieWidth(window.innerWidth)
    }
    const success = (message) => {
        messageApi.open({
            type: 'success',
            content: message,
        });
    };

    const error = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    const getInfo = () => {//从后端更新数据的函数
        axios.post(url()+'getuserinfo',userInfo.phone)
            .then(
                (res) => {
                    setUserInfo({
                        name:res.data.name,
                        sex: res.data.sex,
                        head_img: res.data.head_img,
                        unit: res.data.unit,
                        position: res.data.position,
                        mail: res.data.mail,
                        phone: res.data.phone,
                        password: res.data.password
                    });
                    setSex(res.data.sex);
                },
                (err) => {
                    error('获取个人信息失败');
                });
    }

    useEffect(() => {//组件渲染时调用的函数
        if(userInfo.phone === '') {
            history.push("/login/messagelogin")
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    const handleOk = () => {
        axios.post(url() + 'changeinfo',JSON.stringify(userInfo))
            .then(
                (res) => {
                    if(res.data === "修改成功") {
                        success(res.data)
                    } else {
                        error(res.data)
                    }
                },
                (err) => {
                    error("请求失败，请检查你的网络")
                }
            )
        setIsModal(false);
    };

    const handleCancel = () => {
        setIsModal(false);
    }

    const inputBox = (message) => {//输入式提交信息的函数
        const change = (event) => {
            if (message === 'position') {
                setUserInfo({...userInfo,position: event.target.value});
            }
            if (message === 'unit') {
                setUserInfo({...userInfo,unit: event.target.value});
            }
            if (message === 'mail') {
                setUserInfo({...userInfo,mail: event.target.value});
            }
            if (message === 'password') {
                setUserInfo({...userInfo,password: event.target.value});
            }
            if (message === 'name') {
                setUserInfo({...userInfo, name: event.target.value});
            }
        }
        const changeInfo = () => {
            axios.post(url()+'changeinfo',JSON.stringify(userInfo))
                .then(
                    (res) => {
                        if(res.data === '修改成功') {
                            success(res.data);
                            setChangeButton('')
                        } else {
                            error(res.data);
                        }
                    },
                    (err) => {
                        error('请求失败，请检查您的网络');
                    }
                )
        }
        const cancel = () => {
            setChangeButton(null);
            getInfo();
        }
        return (
            <div className="info-changeInfo">
                <Input placeholder={"请修改您的信息"} onChange={change}></Input>
                <div className="info-buttonBox">
                    <Button type="primary" onClick={changeInfo} size={deviceWidth <= 768 ? 'small' : 'middle'}>确认</Button>
                    <Button onClick={cancel} size={deviceWidth <= 768 ? 'small' : 'middle'}>取消</Button>
                </div>
            </div>
        )
    }

    const selectBox = () => {//选择式提交信息的函数
        function changeInfo (){
            axios.post(url() + 'changeinfo',JSON.stringify(userInfo))
                .then(
                    (res) => {
                        if(res.data === '修改成功') {
                            success(res.data)
                            setChangeButton('')
                        } else {
                            error(res.data)
                        }
                    },
                    (err) => {
                        err('请求失败，请检查您的网络')
                    }
                )
        }
        const cancel = () => {
            setChangeButton(null);
            getInfo();
        }
        const onChange = (e: RadioChangeEvent) => {
            setSex(e.target.value)
            setChangeButton(e.target.value)
            setUserInfo({...userInfo,sex: e.target.value})
        };

        return (
            <div className="info-changeInfo">
                <Radio.Group onChange={onChange} value={sex}>
                    <Radio value={'男'}>男</Radio>
                    <Radio value={'女'}>女</Radio>
                    <Radio value={'保密'}>保密</Radio>
                </Radio.Group>
                <div className="info-buttonBox">
                    <Button type="primary" onClick={changeInfo} size={deviceWidth <= 768 ? 'small' : 'middle'}>确认</Button>
                    <Button onClick={cancel} size={deviceWidth <= 768 ? 'small' : 'middle'}>取消</Button>
                </div>
            </div>
        )
    }

    const infoBox = (message,box) => {//显示个人信息的函数
        return (
            <div className="info-box-infoBox-in">{message}
                <Button className="info-changeButton" type='link' icon={<EditOutlined/>} onClick={() => setChangeButton(box)}>修改</Button>
            </div>
        )
    }

    const infoBoxName = (message,box) => {//显示个人信息的函数
        return (
            <div className="info-box-infoBox-name">{message === '' ? '用户' + userInfo.phone : message}
                <Button className="info-changeButton" type='link' icon={<EditOutlined/>} onClick={() => setChangeButton(box)}>修改</Button>
            </div>
        )
    }

    const phoneBox = (message) => {
        return (
            <div className="info-box-infoBox-in">
                {message}
            </div>
        )
    }

    function handleCustomRequest(options) {//用于上传图片的函数
        const { file } = options;
        const reader = new FileReader();
        reader.onloadend = () => {
            setUserInfo({...userInfo,head_img: reader.result});
            console.log(reader.result)
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        setIsModal(true);
    }

    return (
        <Layout className="layout">
            <HeaderNavigation></HeaderNavigation>
            <div className="info-box" style={{
                paddingRight: deviceWidth <= 768 ? `${1000 - deviceWidth}px` : 0
            }}>
                <div className="info-box-information">
                    <div className="info-box-name">
                        <Upload customRequest={handleCustomRequest} className="info-upload">
                            {userInfo.head_img === '' ? <Avatar className="info-headimg" icon={<UserOutlined />}/> : <Avatar className="info-headimg" src={userInfo.head_img}/>}
                        </Upload>
                        {changeButton === "name" ? inputBox('name') : infoBoxName(userInfo.name,"name")}
                    </div>
                    <Divider className="info-line"/>
                    <div className="info-box-infoBox">
                        手机：{phoneBox(userInfo.phone)}
                    </div>
                    <Divider className="info-line"/>
                    <div className="info-box-infoBox">
                        性别：{changeButton === "sex" ? selectBox('sex') : infoBox(userInfo.sex,"sex")}
                    </div>
                    <Divider className="info-line"/>
                    <div className="info-box-infoBox">
                        邮箱：{changeButton === "mail" ? inputBox('mail') : infoBox(userInfo.mail,"mail")}
                    </div>
                    <Divider className="info-line"/>
                    <div className="info-box-infoBox">
                        公司：{changeButton === "unit" ? inputBox('unit') : infoBox(userInfo.unit,"unit")}
                    </div>
                    <Divider className="info-line"/>
                    <div className="info-box-infoBox">
                        职位：{changeButton === "position" ? inputBox('position') : infoBox(userInfo.position,"position")}
                    </div>
                    <Divider className="info-line"/>
                    <div className="info-box-infoBox">
                        密码：{changeButton === "password" ? inputBox('password') : infoBox(userInfo.password,"password")}
                    </div>
                    <Divider className="info-line"/>
                    <div className="info-back-button-box">
                        <Button icon={<LeftOutlined />} type="link" onClick={() => history.goBack()}>
                            返回
                        </Button>
                    </div>

                </div>
                {contextHolder}
                <Modal title="提示" open={isModal} onOk={handleOk} onCancel={handleCancel}>
                    是否确认上传头像
                </Modal>
            </div>
        </Layout>

    );
};

export default UserProfile;