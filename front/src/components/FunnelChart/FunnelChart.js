import React, {useContext, useEffect, useState} from 'react';
import ReactEcharts from 'echarts-for-react';
import {Button, Form, Input, InputNumber, Steps, Radio, Modal, message, Space} from "antd";
import axios from "axios";
import {MyContext} from "../../App";
import url from "../../url";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const BarChart = () => {
    const {userInfo,setUserInfo} = useContext(MyContext);
    const [isModal, setIsModal] = useState(false);//用于改变弹窗状态
    const [data, setData] = useState({
        legend: {
            orient: 'vertical',
            left: 'left',
            data: []
        },
        title: {
            text: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        series: [
            {
                data: [],
                type: 'funnel',
            },
        ],
    });
    const [chart, setChart] = useState({
        phone: userInfo.phone,
        value: '',
        date: '',
        title: '',
        id: userInfo.id,
        type: 4
    })

    const [step, setStep] = useState(0)
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        axios.post(url() + 'getchat',userInfo.id)
            .then(
                (res) => {
                    if(res.data !== ''){
                        setData(JSON.parse(res.data.value));
                        setStep(2);
                    }
                },
                (err) => {
                    error("文章加载失败，请检测您的网络");
                }
            )
    },[]);

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
    const setTitles = (values) => {
        setData(()=>{
            const strArr =  values.sights.map(obj => obj['name']);
            const newlegend = {...data.legend,data: strArr}
            const newseries = {data: values.sights,type:'funnel'}
            return {...data,legend: newlegend,series: newseries}
        })
        setStep(2)
    }

    function isInt(value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    }

    const save = () => {
        axios.post( url() + "/chart",JSON.stringify(chart))
            .then(
                (res) => {
                    if(isInt(res.data)) {
                        success('上传成功');
                        setChart({...chart,id: res.data});
                        setIsModal(false);
                        setUserInfo({...userInfo,id: res.data});
                    } else {
                        error(res.data);
                    }
                },
                (err) => {
                    error('请求失败，请检查您的网络')
                });
    }

    const dele = () => {
        axios.post( url() + "/deletechart",chart.id)
            .then(
                (res) => {
                    if(res.data==='删除成功') {
                        success(res.data);
                        setChart({
                            value: '',
                            phone: userInfo.phone,
                            date: '',
                            title: '',
                            id: userInfo.id,
                            type: 0
                        });
                    } else {
                        error(res.data);
                    }
                },
                (err) => {
                    error('请求失败，请检查您的网络')
                });
    }

    function handleOk() {
        setChart({...chart,value: JSON.stringify(data)});
        setIsModal(true);
    }

    function handleCancel() {
        setIsModal(false)
    }

    function controlBox () {
        if (step === 0) {
            return (
                <div className="BarCharts-control-box">
                    <div className="BarCharts-InputNumber-box">
                        <div className="BarCharts-InputTxt-box">
                            请输入图表名称:
                        </div>
                        <Input className="BarCharts-InputNumber" onChange={(event)=>{
                            setData({...data,title: {text: event.target.value, left: "center"}});
                            setChart({...chart,title: event.target.value})
                        }}/>
                        <Button type="primary" onClick={() => {setStep(1)}}>下一步</Button>
                    </div>
                </div>
            )
        }
        if (step === 1) {
            return (
                <div className="BarCharts-control-box">
                    <div className="BarCharts-InputNumber-box">
                        <Form
                            name="dynamic_form_complex"
                            onFinish={setTitles}
                            autoComplete="off"
                            className={"pie-form"}
                        >
                            <Form.List name="sights">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field) => (
                                            <div key={field.key} align="baseline" className={"pie-space"}>
                                                <Form.Item
                                                    noStyle
                                                    shouldUpdate={(prevValues, curValues) =>
                                                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                                    }
                                                >
                                                    {() => (
                                                        <Form.Item
                                                            {...field}
                                                            label={"参数"}
                                                            name={[field.name, 'name']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '请输入参数名称',
                                                                },
                                                            ]}
                                                        >
                                                            <Input className={"pie-input1"}/>
                                                        </Form.Item>
                                                    )}
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="值"
                                                    name={[field.name, 'value']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入参数的值',
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber className={"pie-input2"} />
                                                </Form.Item>
                                                <MinusCircleOutlined onClick={() => remove(field.name)}  className="dynamic-delete-button"/>
                                            </div>
                                        ))}

                                        <Form.Item className={"BarCharts-form-items"} >
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                            >
                                                增加一个参数
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item className="BarCharts-form-submit">
                                <Button className="BarCharts-form-submit-button" htmlType="button" onClick={()=>{setStep(0)}}>上一步</Button>
                                <Button className="BarCharts-form-submit-button" type="primary" htmlType="submit">绘制</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )
        }
        if (step === 2) {
            return (
                <div className="BarCharts-control-box">
                    <div className="BarCharts-InputNumber-box">
                        <div className={"pie-button-box"}>
                            <Button className={"BarCharts-form-submit-button"} onClick={()=>{setStep(1)}}>上一步</Button>
                            <Button className={"BarCharts-form-submit-button"} onClick={handleOk} type={"primary"}>提交</Button>
                            {userInfo.id === 0 ? null :<Button onClick={dele}>删除</Button>}
                        </div>

                    </div>
                </div>
            )
        }
    }

    return (
        <div className="BarCharts">
            <Steps
                className="BarCharts-step"
                current={step}
                items={[
                    {
                        title: '第一步',
                        description: "填写图表名称",
                    },
                    {
                        title: '第二步',
                        description: "设置表格参数",
                    },
                    {
                        title: '第三步',
                        description: "提交表格",
                    },
                ]}
            />
            {controlBox()}
            <ReactEcharts className="BarCharts-Charts" option={data} />
            {contextHolder}
            <Modal title="提示" open={isModal} onOk={save} onCancel={handleCancel}>
                您确定要提交吗？
            </Modal>
        </div>
    );
};

export default BarChart;