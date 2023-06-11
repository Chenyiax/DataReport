import {Avatar, Button, List, message} from 'antd';
import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import url from "../../url";
import {UserOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {MyContext} from "../../App"
import "./Home.css"

export default function Home() {
    const [messageApi, contextHolder] = message.useMessage();
    const [data1, setData1] = useState([]);
    const [data2, setData2] = useState([]);
    const history = useHistory();
    const {userInfo,setUserInfo} = useContext(MyContext);

    const error = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    useEffect(() => {//组件渲染时调用的函数
        axios.post(url() + 'myartlist', userInfo.phone)
            .then(
                (res) => {
                    setData1(JSON.parse(JSON.stringify(res.data)))
                },
                (err) => {
                    error("文章加载失败，请检测您的网络");
                }
            )
        axios.post(url() + 'mychatlist', userInfo.phone)
            .then(
                (res) => {
                    setData2(JSON.parse(JSON.stringify(res.data)))
                },
                (err) => {
                    error("文章加载失败，请检测您的网络");
                }
            )
    },[]);

    return (
        <div className={"article-list-box"}>
            <div className="home-title">
                我发布的文章
            </div>
            <List
                pagination={{
                    position:'bottom',
                    align:'center',
                    pageSize: 3
                }}
                dataSource={data1}
                renderItem={(item, index) => (
                    <List.Item onClick={() => {
                        if (item.type === 0) {
                            setUserInfo({...userInfo,id:item.id});
                            history.push("/main/article/showarticle");
                        } else {
                            window.open(item.txt, '_blank');
                        }
                    }}>
                        <List.Item.Meta
                            avatar={item.head_img === '' ? <Avatar size={48} className="info-headimg" icon={<UserOutlined />}/> : <Avatar size={48} className="info-headimg" src={item.head_img}/>}
                            title={<div>{item.title}</div>}
                            description={item.date}
                        />
                    </List.Item>
                )}
            />
            <div className="home-title">
                我发布的图表
            </div>
            <List
                pagination={{
                    position:'bottom',
                    align:'center',
                    pageSize: 3
                }}
                dataSource={data2}
                renderItem={(item, index) => (
                    <List.Item onClick={() => {
                        setUserInfo({...userInfo,id:item.id});
                        history.push("/main/chart/showchat");
                    }}>
                        <List.Item.Meta
                            avatar={item.head_img === '' ? <Avatar size={48} className="info-headimg" icon={<UserOutlined />}/> : <Avatar size={48} className="info-headimg" src={item.head_img}/>}
                            title={<div>{item.title}</div>}
                            description={item.date}
                        />
                    </List.Item>
                )}
            />
            {contextHolder}
        </div>
    );
};