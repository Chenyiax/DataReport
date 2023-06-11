import React, {useContext, useEffect, useState} from 'react';
import ReactEcharts from 'echarts-for-react';
import {Button, Form, Input, InputNumber, Steps, Radio, Modal, message} from "antd";
import './BarChart.css'
import axios from "axios";
import {MyContext} from "../../App";
import url from "../../url";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const BarChart = () => {
    const [legend, setLengend] = useState('')
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
        xAxis: {
            type: 'category',
            data: [],
        },
        yAxis: {
            type: 'value',
        },
        tooltip: {
            trigger: 'item',
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        series: [],
    });
    const [chart, setChart] = useState({
        phone: userInfo.phone,
        value: '',
        date: '',
        title: '',
        id: userInfo.id,
        type: 0
    })

    const [step, setStep] = useState(0)
    const [type, setType] = useState('bar')
    const option = ['柱状图', '折线图'];
    const [temp, setTemp] = useState(0)
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        axios.post(url() + 'getchat',userInfo.id)
            .then(
                (res) => {
                    if(res.data !== ''){
                        setData(JSON.parse(res.data.value));
                        setTemp(JSON.parse(res.data.value).series.length)
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
        setData({
            ...data
            ,xAxis: {
                type: 'category',
                data:  values.names
            },
        })
        setStep(2);
    }

    const setValues = (values) => {
        setData(prevData => {
            const newSeries = [...prevData.series];
            newSeries.push({
                name: legend,
                data: Object.values(values).filter(value => typeof value === "number"),
                type: type
            });
            return {
                ...prevData,
                legend: { ...prevData.legend,data: [...prevData.legend.data, legend] },
                series: newSeries
            };
        }, setTemp(temp + 1));
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

    const onChange = (e) => {
        if (e.target.value === '折线图') {
            setType('line')
        } else {
            setType('bar')
        }
    };

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
                        <Form onFinish={setTitles}>
                            <Form.List
                                name={"names"}
                                rules={[
                                    {
                                        validator: async (_, names) => {
                                            if (!names || names.length < 1) {
                                                return Promise.reject(new Error('至少有一个参数'));
                                            }
                                        },
                                    },
                                ]}
                            >
                                {(fields, { add, remove }, { errors }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Form.Item className={"BarCharts-form-items"}
                                                label={`请输入第${index+1}列的名称`}
                                                       name={`value_${index}`}
                                                required={false}
                                                key={field.key}
                                            >
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message: "请输入参数名称",
                                                        },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input placeholder="请输入参数名称"  style={{ width: '90%' }}/>
                                                </Form.Item>
                                                {fields.length > 1 ? (
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => remove(field.name)}
                                                    />
                                                ) : null}
                                            </Form.Item>
                                        ))}
                                        <Form.Item className={"BarCharts-form-items"}>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                icon={<PlusOutlined />}
                                            >
                                                增加一个参数名称
                                            </Button>
                                            <Form.ErrorList errors={errors} />
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                            <Form.Item className="BarCharts-form-submit">
                                <Button className="BarCharts-form-submit-button" htmlType="button" onClick={()=>{setStep(0)}}>上一步</Button>
                                <Button className="BarCharts-form-submit-button" type="primary" htmlType="submit">下一步</Button>
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
                            {[...Array(data.xAxis.data.length)].map((_, index) => (
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
                                <Radio.Group options={option} defaultValue={'柱状图'} onChange={onChange}>
                                    <Radio value={'柱状图'} />
                                    <Radio value={'折线图'} />
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item className="BarCharts-form-submit">
                                {temp === 0 ?
                                    <>
                                        <Button className="BarCharts-form-submit-button" onClick={()=>{setStep(1);}}>上一步</Button>
                                        <Button className="BarCharts-form-submit-button" type="primary" htmlType="submit">完成</Button>
                                    </> :
                                    <>
                                        <Button className="BarCharts-form-submit-button" onClick={() => {
                                            if(temp === 1) {
                                                setData(prevData=>({
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
                                                    series: prevData.series.slice(0, -1),
                                                    legend: {
                                                        ...prevData.legend,
                                                        data: prevData.legend.data.slice(0, -1)
                                                    }
                                                }));
                                            }
                                            setTemp(temp - 1);
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

    function handleOk() {
        setChart({...chart,value: JSON.stringify(data)});
        setIsModal(true);
    }

    function handleCancel() {
        setIsModal(false)
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
                        description: "设置表格横轴",
                    },
                    {
                        title: '第三步',
                        description: "填写表格数值",
                    },
                ]}
            />
            {controlBox()}
            <ReactEcharts className="BarCharts-Charts" option={data} notMerge={true} />
            <Modal title="提示" open={isModal} onOk={save} onCancel={handleCancel}>
                您确定要提交吗？
            </Modal>
            {contextHolder}
        </div>
    );
};

export default BarChart;
