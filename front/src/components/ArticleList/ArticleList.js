import {Avatar, Button, List, message} from 'antd';
import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import url from "../../url";
import {UserOutlined} from "@ant-design/icons";
import './ArticleList.css'
import {useHistory} from "react-router-dom";
import {MyContext} from "../../App"


export default function ArticleList() {
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState([]);
    const history = useHistory();
    const {userInfo,setUserInfo} = useContext(MyContext);
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
        axios.post(url() + 'artlist', userInfo.unit)
            .then(
                (res) => {
                    setData(JSON.parse(JSON.stringify(res.data)))
                },
                (err) => {
                    error("文章加载失败，请检测您的网络");
                }
            )
    },[]);

    return (
        <div className={"article-list-box"}>
            <List
                pagination={{
                    position:'bottom',
                    align:'center',
                }}
                dataSource={data}
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
            {contextHolder}
        </div>
    );
};