import {Button, Checkbox, Divider, Input, message, Modal} from "antd";
import './MessageLogin.css'
import {useContext, useState} from "react";
import agreement from '../../resource/agreement.png'
import policy from '../../resource/policy.png'
import axios from 'axios';
import url from '../../url'
import {useHistory} from "react-router-dom";
import {MyContext} from "../../App"

export default function messageLogin() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history = useHistory();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [countdown, setCountdown] = useState(60);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [disabled, setDisabled] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [user, setUser] = useState({phone:'',id_code:''});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let [check, setCheck] = useState(true);//用于控制登录按钮
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isModalOpen, setIsModalOpen] = useState(false);//用于唤起弹窗
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isModal, setIsModal] = useState(true);//用于改变弹窗状态
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
        setCheck(check = check === false)
    }

    const showModal1 = () => {
        setIsModal(true)
        setIsModalOpen(true);
    };

    const showModal2 = () => {
        setIsModal(false)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    //发送验证码
    const getPhone = () => {
        if (user.phone.length < 11 || !(!isNaN(parseFloat(user.phone)) && isFinite(user.phone))) {
            error('手机号格式错误');
            return;
        }

        setDisabled(true);
        const interval = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
            clearInterval(interval);
            setCountdown(60);
            setDisabled(false);
        }, 60000);

        axios.post( url() + "getcode",user.phone)
            .then(
                (res) => {
                    if(res.data === '验证码发送成功') {
                        success(res.data);
                    } else {
                        error(res.data);
                    }
                },
                (err) => {
                    error('请求失败，请检查您的网络')
                });
    }
    const login = () => {
        axios.post(url() + 'login',JSON.stringify(user))
            .then(
                (res) => {
                    if (res.data === '登录成功') {
                        success(res.data);
                        axios.post(url() + 'getuserinfo',user.phone)
                            .then(
                                (response) => {
                                    setUserInfo({...response.data,id: 0,selectedKeys: '/main/home'});
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
                    error('请求失败，请检查您的网络');
                }
            )
    }

    return (
        <div className="inputBox">
            <div className="head">请输入手机号</div>
            <Input className="input-account" placeholder="手机号" maxLength={11} onChange={(event)=>{setUser({phone: event.target.value,id_code: user.id_code})}}/>
            <Divider className="line"/>
            <div className="head">请输入验证码</div>
            <div className= "idCode">
                <Input.Password className="input-check" placeholder="验证码" maxLength={6} onChange={(event) => {setUser({phone:user.phone,id_code: event.target.value})}}/>
                <Button className="codeBtn" onClick={getPhone} disabled={disabled} loading={disabled}> {disabled ? `${countdown}s` : '获取验证码'}</Button>
            </div>
            <Divider className="line"/>
            <div className="buttonBox">
                <Button className={check ? "disable" : "loginButton"} disabled={check} onClick={login}>登录/注册</Button>
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