import './Main.css'
import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, Layout} from 'antd';
import HeaderNavigation from "../../components/HeaderNavigation/HeaderNavigation";
import {SiderMenu} from "../../components/SiderMenu/SiderMenu";
import {Content} from "antd/es/layout/layout";
import {Route} from "react-router-dom";
import Article from "../../components/Article/Article"
import ArticleList from "../../components/ArticleList/ArticleList";
import ShowArticle from "../../components/ShowArticle/ShowArticle";
import BarChart from "../../components/BarChart/BarChart"
import ChartList from "../../components/ChartList/ChartList"
import ShowChart from "../../components/ShowChart/ShowChart"
import Link from "../../components/Link/Link"
import Home from "../../components/Home/Home"
import Pie from "../../components/Pie/Pie"
import RadarChart from "../../components/RadarChart/RadarChart";
import ScatterChart from "../../components/ScatterChart/ScatterChart"
import FunnelChart from  "../../components/FunnelChart/FunnelChart"
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const PageLayout = () => {
    const [deviceWidth , setDevieWidth] = useState(false);
    function handleResize() {
        setDevieWidth(window.innerWidth)
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    return (
        <Layout className='layout'>
            <HeaderNavigation deviceWidth={deviceWidth}/>
            <Layout className="site-layout">
                <SiderMenu />
                <Content className={'content'}  style={{
                    paddingRight: deviceWidth <= 768 ? `${1000 - deviceWidth}px` : 0
                }}>
                    <Route path="/main/article/list" component={ArticleList}></Route>
                    <Route path="/main/article/showarticle" component={ShowArticle}></Route>
                    <Route path="/main/article/article" component={Article}></Route>
                    <Route path="/main/chart/barchart" component={BarChart}></Route>
                    <Route path="/main/chart/list" component={ChartList}></Route>
                    <Route path="/main/chart/showchat" component={ShowChart}></Route>
                    <Route path="/main/article/link" component={Link}></Route>
                    <Route path="/main/home" component={Home}></Route>
                    <Route path="/main/chart/pie" component={Pie}></Route>
                    <Route path="/main/chart/radarchart" component={RadarChart}></Route>
                    <Route path="/main/chart/scatterchart" component={ScatterChart}></Route>
                    <Route path="/main/chart/funnelchart" component={FunnelChart}></Route>
                </Content>
            </Layout>
        </Layout>
    );
};

export default PageLayout;

