import React, {useContext, useEffect, useState} from 'react';
import ReactEcharts from 'echarts-for-react';
import {Button, Form, Input, InputNumber, Steps, Radio, Modal, message, Space} from "antd";
import axios from "axios";
import {MyContext} from "../../App";
import url from "../../url";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const BarChart = () => {
    const [legend, setLengend] = useState('')
    const [temp, setTemp] = useState(0)
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
        radar: {
            indicator: []
        },
        tooltip: {
            trigger: 'item',
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        series: []
    });
    const [chart, setChart] = useState({
        phone: userInfo.phone,
        value: '',
        date: '',
        title: '',
        id: userInfo.id,
        type: 2
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
        setData(prevData=>{
            const strArr =  values.sights.map(obj => obj['name']);
            const newlegend = {...data.legend,data: strArr}
            const newRadar = {
                indicator: values.sights
            }
            return {...prevData,legend: newlegend, radar: newRadar}
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

    function setValues(values) {
        setData(prevData => {
            if (temp === 0) {
                const newSeries = [];
                newSeries.push({
                    name: legend,
                    value: Object.values(values).filter(value => typeof value === "number"),
                });
                return {
                    ...prevData,
                    legend: { ...prevData.legend,data: [...prevData.legend.data, legend] },
                    series: {
                        type: 'radar',
                        data: newSeries
                    }
                };
            } else {
                const newSeries = [...prevData.series.data];
                newSeries.push({
                    name: legend,
                    value: Object.values(values).filter(value => typeof value === "number"),
                });
                return {
                    ...prevData,
                    legend: { ...prevData.legend,data: [...prevData.legend.data, legend] },
                    series: {
                        type: 'radar',
                        data: newSeries
                    }
                };
            }
        });
        setTemp(temp + 1);
    }

    const changeLegend = (event) => {
        setLengend(event.target.value);
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
                                                            label={"维度"}
                                                            name={[field.name, 'name']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '请输入维度名称',
                                                                },
                                                            ]}
                                                        >
                                                            <Input className={"pie-input1"}/>
                                                        </Form.Item>
                                                    )}
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="最大值"
                                                    name={[field.name, 'value']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入维度最大值',
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
                                                增加一个维度
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
                        <Form
                            className={"pie-form"}
                            onFinish={setValues}
                        >
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: `请输入数值的名称`,
                                    },
                                ]}
                                label={"请输入数值的名称"}
                                style={{width:"auto"}}
                            >
                                <Input onChange={changeLegend}/>
                            </Form.Item>
                            {[...Array(data.radar.indicator.length)].map((_, index) => (
                                <Form.Item
                                    key={index}
                                    name={`value_${index}`}
                                    label={`请输入第${index+1}列的值`}
                                    rules={[
                                        {
                                            required: true,
                                            message: `请输入第${index+1}列的值`,
                                        },
                                    ]}
                                >
                                    <InputNumber style={{width:'100%'}}/>
                                </Form.Item>
                            ))}
                            <Form.Item className="BarCharts-form-submit">
                                {temp === 0 ?
                                    <>
                                        <Button className="BarCharts-form-submit-button" onClick={()=>{setStep(1);}}>上一步</Button>
                                        <Button className="BarCharts-form-submit-button" type="primary" htmlType="submit">完成</Button>
                                    </> :
                                    <>
                                        <Button className="BarCharts-form-submit-button" onClick={() => {
                                            setTemp(temp => {
                                                if (temp === 1) {
                                                    setData(prevData => ({
                                                        ...prevData,
                                                        series: [],
                                                        legend: {
                                                            ...prevData.legend,
                                                            data: []
                                                        }
                                                    }));
                                                } else {
                                                    setData(prevData => ({
                                                        ...prevData,
                                                        series: {
                                                            ...prevData.series,
                                                            data: prevData.series.data.slice(0,-1)
                                                        },
                                                        legend: {
                                                            ...prevData.legend,
                                                            data: prevData.legend.data.slice(0, -1)
                                                        }
                                                    }));
                                                }
                                                return temp - 1;
                                            });
                                        }}>上一步</Button>
                                        <Button className="BarCharts-form-submit-button" type="primary" htmlType="button" onClick={handleOk}>提交</Button>
                                        <Button className="BarCharts-form-submit-button" type="primary" htmlType="submit">继续添加</Button>
                                        {userInfo.id === 0 ? null :
                                            <Button className="BarCharts-form-submit-button" type="primary" htmlType="button" onClick={dele}>删除</Button>
                                        }
                                    </>
                                }
                            </Form.Item>
                        </Form>
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
                        description: "设置表格维度",
                    },
                    {
                        title: '第三步',
                        description: "提交表格",
                    },
                ]}
            />
            {controlBox()}
            <ReactEcharts className="BarCharts-Charts" option={data} notMerge={true}/>
            {contextHolder}
            <Modal title="提示" open={isModal} onOk={save} onCancel={handleCancel}>
                您确定要提交吗？
            </Modal>
        </div>
    );
};

export default BarChart;