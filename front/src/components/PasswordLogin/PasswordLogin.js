import {Button, Checkbox, Divider, Input, message, Modal} from 'antd';
import './PasswordLogin.css'
import React, {useContext, useState} from 'react';
import agreement from '../../resource/agreement.png'
import policy from '../../resource/policy.png'
import axios from 'axios';
import url from '../../url'
import {useHistory} from 'react-router-dom';
import {MyContext} from '../../App'

function passwordLogin() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history = useHistory()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [user,setUser] = useState({phone: '',password:''})
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [check, setCheck] = useState(true);//用于控制登录按钮
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isModalOpen, setIsModalOpen] = useState(false);//用于唤起弹窗
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isModal, setIsModal] = useState(true);//用于唤起弹窗
    const [messageApi, contextHolder] = message.useMessage();//用于唤起提示框
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {setUserInfo} = useContext(MyContext);

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

    const onChange = () => {
        setCheck(check = check === false);
    }

    const showModal1 = () => {
        setIsModal(true);
        setIsModalOpen(true);
    };

    const showModal2 = () => {
        setIsModal(false);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const login = () => {
        axios.post(url() + 'passwordlogin',JSON.stringify(user))
            .then(
                (res) => {
                    if (res.data === '登录成功') {
                        axios.post(url() + 'getuserinfo',user.phone)
                            .then(
                                (response) => {
                                    setUserInfo({...response.data,id: 0,selectedKeys:'/main/home'});
                                    success(res.data);
                                    history.push('/main/home');
                                },
                                (err) => {
                                    error("获取个人信息失败，请重新登录")
                                }
                            )
                    } else {
                        error(res.data);
                    }
                },
                (err) => {
                    err('请求失败，请检查您的网络');
                }
            );
    }

    return (
        <div className="inputBox">
            <div className="head">用户名/手机号/邮箱</div>
            <Input className="input-account" placeholder="用户名/手机号/邮箱" maxLength={20} onChange={(event) => {setUser({phone: event.target.value,password: user.password})}}/>
            <Divider className="line"/>
            <div className="head">密码</div>
            <Input.Password  className="input-account" placeholder="请输入密码" maxLength={20} onChange={(event) => {setUser({phone: user.phone,password:event.target.value})}}/>
            <Divider className="line"/>
            <div className="buttonBox">
               <Button className={check ? "disable" : "loginButton"} disabled={check} onClick={login}>登录</Button>
            </div>
            <div className="check">
                <Checkbox onChange={onChange} />
                <div className="checkTxt">我已经阅读并同意
                    <div className="login-link" onClick={showModal1}>《用户服务协议》</div> 、
                    <div className="login-link" onClick={showModal2}>《隐私政策》</div>
                </div>
            </div>
            {contextHolder}
            <Modal title="用户服务协议" open={isModalOpen} onOk={handleOk} onCancel={handleOk}>
                {isModal ? <img className="agree" src={agreement} alt={"用户服务协议"}/> : <img className="agree" src={policy} alt={"隐私政策"}/>}
            </Modal>

        </div>
    )
}

export default passwordLogin;