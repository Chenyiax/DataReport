import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import url from "../../url";
import {Button, message} from "antd";
import {MyContext} from "../../App"
import {useHistory} from "react-router-dom";
import ReactEcharts from "echarts-for-react";
import "./ShowChart.css"

export default function ShowArticle() {
    const [messageApi, contextHolder] = message.useMessage();
    const {userInfo,setUserInfo} = useContext(MyContext);
    const history = useHistory();
    const [chart, setChart] = useState({
        data: {},
        type: ''
    })

    const error = (message) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    useEffect(() => {//组件渲染时调用的函数
        axios.post(url() + 'getchat',userInfo.id)
            .then(
                (res) => {
                    setChart({...res.data,data: JSON.parse(res.data.value)})
                },
                (err) => {
                    error("图表加载失败，请检测您的网络");
                }
            )
    },[]);

    function change() {
        if (chart.type === 0) {
            history.push('/main/chart/barchart')
            setUserInfo({...userInfo,selectedKeys: '/main/chart/barchart'})
        } else if (chart.type === 1) {
            history.push('/main/chart/pie')
            setUserInfo({...userInfo,selectedKeys: '/main/chart/pie'})
        } else if (chart.type === 2) {
            history.push('/main/chart/radarchart')
            setUserInfo({...userInfo,selectedKeys: '/main/chart/radarchart'})
        } else if (chart.type === 3) {
            history.push('/main/chart/scatterchart')
            setUserInfo({...userInfo,selectedKeys: '/main/chart/scatterchart'})
        } else if (chart.type === 4) {
            history.push('/main/chart/funnelchart')
            setUserInfo({...userInfo,selectedKeys: '/main/chart/funnelchart'})
        }
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
            <ReactEcharts className="BarCharts-Charts" option={chart.data}  />
            {userInfo.phone === chart.phone ? btnBoxChange() : btnBoxShow()}
            {contextHolder}
        </div>

    )

}