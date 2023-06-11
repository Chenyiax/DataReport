import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Input, message} from "antd";
import axios from "axios";
import url from "../../url";
import {MyContext} from "../../App";
import "./Link.css"


export default function RichEditor() {
    const {userInfo,setUserInfo} = useContext(MyContext);
    const [article, setArticle] = useState({
        txt: '',
        phone: userInfo.phone,
        date: '',
        title: '',
        id: userInfo.id,
        type: 1
    })
    const [messageApi, contextHolder] = message.useMessage();

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

    function isInt(value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    }

    useEffect(() => {
        axios.post(url() + 'getarticle',userInfo.id)
            .then(
                (res) => {
                    if(res.data !== ''){
                        setArticle({...res.data})
                    }
                },
                (err) => {
                    error("文章加载失败，请检测您的网络");
                }
            )
    },[]);

    const save = () => {
        axios.post( url() + "/article",JSON.stringify(article))
            .then(
                (res) => {
                    if(isInt(res.data)) {
                        success('上传成功');
                        setArticle({...article,id: res.data});
                    } else {
                        error(res.data);
                    }
                },
                (err) => {
                    error('请求失败，请检查您的网络')
                });
    }

    const dele = () => {
        axios.post( url() + "/deletearticle",article.id)
            .then(
                (res) => {
                    if(res.data==='删除成功') {
                        success(res.data);
                        setArticle({
                            txt: '',
                            phone: userInfo.phone,
                            date: '',
                            title: '',
                            id: userInfo.id,
                            type: 1
                        });
                    } else {
                        error(res.data);
                    }
                },
                (err) => {
                    error('请求失败，请检查您的网络')
                });
    }

    return (
        <div className="link">
            <div  className="link-form-box">
                <Form
                    className={"link-form"}
                    layout="vertical"
                    name="basic"
                    labelCol={{
                        span: 16,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        style={{
                        }}
                        label="文章标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: '请输入文章标题',
                            },
                        ]}
                    >
                        <Input className={"link-input"} value={article.title} onChange={(event)=>{setArticle({...article,title: event.target.value})}}/>
                    </Form.Item>

                    <Form.Item
                        label="文章链接"
                        name="url"
                        rules={[
                            {
                                required: true,
                                message: '请输入文章链接',
                            },
                        ]}
                    >
                        <Input className={"link-input"} value={article.txt} onChange={(event)=>{setArticle({...article,txt: event.target.value})}}/>
                    </Form.Item>
                </Form>
                <div className={"article-btn-box"}>
                    <Button className="article-btn" type="primary" onClick={save}>上传</Button>
                    <Button className="article-btn" onClick={dele}>删除</Button>
                </div>
            </div>
            {contextHolder}
        </div>
    )
}