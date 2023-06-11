import './Login.css'
import header from '../../resource/header.png'
import { Menu, MenuProps } from 'antd';
import React, { useState } from 'react';
import { Route,useHistory } from 'react-router-dom';
import messageLogin from '../../components/MessageLogin/MessageLogin'
import passwordLogin from '../../components/PasswordLogin/PasswordLogin'

export default function login() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history = useHistory();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [current, setCurrent] = useState('messagelogin');
    const items: MenuProps['items'] = [
        {
            label: '验证码登录',
            key: 'messagelogin',
        },
        {
            label: '密码登录',
            key: 'passwordlogin',
        },];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        history.push('/Login/'+e.key);
    };

    return (
        <div className="login">
            <div className="imgBox">
                <img src={header} alt="一个账号，创作报表"/>
            </div>
            <div className="box">
                <Menu className="menu" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
                <Route path={"/Login/messagelogin"} component={messageLogin}></Route>
                <Route path={"/Login/passwordlogin"} component={passwordLogin}></Route>
            </div>
        </div>
    );
}