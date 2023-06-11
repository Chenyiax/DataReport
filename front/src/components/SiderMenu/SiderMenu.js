import Sider from "antd/es/layout/Sider";
import {Menu} from "antd";
import React, {useContext, useState} from "react";
import {AreaChartOutlined, FileOutlined, HomeOutlined,} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {MyContext} from "../../App";
import './SiderMenu.css'


function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('数据展示', 'sub1', <HomeOutlined />, [
        getItem('我的创作', '/main/home'),
        getItem('文章列表', '/main/article/list'),
        getItem('图表列表', '/main/chart/list'),
    ]),
    getItem('新增文章', 'sub2', <FileOutlined />,[
        getItem('新增文章', '/main/article/article'),
        getItem('新增链接', '/main/article/link'),
    ]),
    getItem('新增图表', 'sub3', <AreaChartOutlined />, [
        getItem('新增柱状/折线图', '/main/chart/barchart'),
        getItem('新增饼图', '/main/chart/pie'),
        getItem('新增雷达图', '/main/chart/radarchart'),
        getItem('新增散点图','/main/chart/scatterchart'),
        getItem('新增漏斗图','/main/chart/funnelchart'),

    ]),
];

export function SiderMenu() {
    const {userInfo,setUserInfo} = useContext(MyContext);
    const history = useHistory()
    const [collapsed, setCollapsed] = useState(false);

    const navigate = (event) => {
        history.push(event.key.toString())
        setUserInfo({...userInfo,id: 0,selectedKeys: event.key.toString()})
    }

    return (
        <Sider className="sider-menu" theme={"light"} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <Menu theme={"light"} selectedKeys={userInfo.selectedKeys} mode="inline" onClick={navigate} items={items}>
            </Menu>
        </Sider>
    )
}