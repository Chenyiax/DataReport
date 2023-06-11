import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import url from "../../url";
import {Button, message} from "antd";
import {MyContext} from "../../App"
import './ShowArticle.css'
import {useHistory} from "react-router-dom";

export default function ShowArticle() {
    const [messageApi, contextHolder] = message.useMessage();
    const {userInfo,setUserInfo} = useContext(MyContext);
    const history = useHistory();
    const [article, setArticle] = useState({
        txt: ''
    })

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

    useEffect(() => {//组件渲染时调用的函数
        axios.post(url() + 'getarticle',userInfo.id)
            .then(
                (res) => {
                    setArticle({...res.data})
                },
                (err) => {
                    error("文章加载失败，请检测您的网络");
                }
            )
    },[]);

    function change() {
        history.push('/main/article/article')
        setUserInfo({...userInfo,selectedKeys: '/main/article/article'})
    }
    function back() {
        history.goBack();
        setUserInfo({...userInfo,id: 0})
    }
    function btnBoxChange() {
        return (
            <div className={"article-btn-box"}>
                <Button className="article-btn" type={"primary"} onClick={change}>修改</Button>
                <Button className="article-btn" onClick={back}>返回</Button>
            </div>
        )
    }

    function btnBoxShow() {
        return (
            <div className={"article-btn-box"}>
                <Button className="article-btn" onClick={back}>返回</Button>
            </div>
        )
    }

    return (
        <div className="showArticle-article-box">
            <div dangerouslySetInnerHTML={{__html: article.txt}}></div>
            {userInfo.phone === article.phone ? btnBoxChange() : btnBoxShow()}
            {contextHolder}
        </div>
    )

}