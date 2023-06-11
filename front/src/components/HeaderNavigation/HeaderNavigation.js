import {Header} from "antd/es/layout/layout";
import {Avatar} from "antd";
import {UserOutlined} from "@ant-design/icons";
import './HeaderNavigation.css'
import React, {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {MyContext} from "../../App";
import img from "../../resource/img.png"
import img1 from "../../resource/miniheader.png"

const HeaderNavigation = (props) => {
    const history = useHistory();
    const {userInfo} = useContext(MyContext);
    const [isMobile, setIsMobile] = useState(false);
    function handleResize() {
        setIsMobile(window.innerWidth <= 768);
    }
    //在组件渲染时获取头像
   useEffect(() => {
       if (userInfo.phone === '') {
           history.push("/login/messagelogin")
       }
       handleResize();
       window.addEventListener('resize', handleResize);
       return () => {
           window.removeEventListener('resize', handleResize);
       };
   },[])
    return (
        <Header className="headerNavigation" style={{
            paddingRight: props.deviceWidth <= 768 ? `${1000 - props.deviceWidth}px` : 0
        }}>
            <div className="headerNavigation-img" onClick={() => history.push('/main')}>
                {isMobile ?
                    <div className="headerNavigation-mini-img-box">
                        <img className="headerNavigation-mini-img1" alt="企业数据报表" src={img1}/>
                    </div> : <img alt="企业数据报表管理系统" src={img}/>}
            </div>
            <div className="headerNavigation-info-box" onClick={() => history.push('/information')}>
                {isMobile ? <div></div> :
                    <div className="headerNavigation-username">
                        {userInfo.name === '' ? '用户' + userInfo.phone : userInfo.name}
                    </div>
                }
                <div className="headerNavigation-header">
                    {userInfo.head_img === '' ? <Avatar className="headerNavigation-svg" size={56}  icon={<UserOutlined />}/> : <Avatar size={56} src={userInfo.head_img}/>}
                </div>
            </div>
        </Header>
    );
};

export default HeaderNavigation;