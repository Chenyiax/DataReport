import React, {useContext, useEffect, useRef, useState} from 'react';
import ReactEcharts from 'echarts-for-react';
import {Button, Form, Input, InputNumber, Steps, Radio, Modal, message} from "antd";
import axios from "axios";
import {MyContext} from "../../App";
import url from "../../url";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const BarChart = () => {
    const chartRef = useRef();
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
            type: 'value',
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
        series: []
    });
    const [chart, setChart] = useState({
        phone: userInfo.phone,
        value: '',
        date: '',
        title: '',
        id: userInfo.id,
        type: 3
    })

    const [step, setStep] = useState(0)
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
        const echart = chartRef.current.getEchartsInstance();
        setData(prevState => {
            const newSeries= prevState.series;
            newSeries.push({
                name: legend,
                data: values.sights.map(obj => Object.values(obj).map(val => Number(val))),
                type: 'scatter'
            })
            const newlegend = {...prevState.legend};
            newlegend.data.push(legend);

            return {...prevState,series: newSeries,legend: newlegend}
        })
        echart.setOption(data);
        setTemp(temp+1);
    }

    // const setValues = (values) => {
    //     setData(prevData => {
    //         const newSeries = [...prevData.series];
    //         newSeries.push({
    //             name: legend,
    //             data: Object.values(values).filter(value => typeof value === "number"),
    //             type: type
    //         });
    //         const newlegend = {...prevData.legend};
    //         newlegend.data.push(legend);
    //         return {
    //             ...prevData,
    //             legend: newlegend,
    //             series: newSeries
    //         };
    //     });
    //     setTemp(temp + 1);
    // }

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

    const goBack = () => {
        if (temp === 0) {
            setStep(0);
        } else {
            const echart = chartRef.current.getEchartsInstance();
            setData(prevState => {
                const newSeries= prevState.series;
                newSeries.pop()
                const newlegend = {...prevState.legend};
                newlegend.data.pop();
                return {...prevState,series: newSeries,legend: newlegend}
            })
            const title = data.title.text
            setData({...data,title:{
                left: 'center',
                    text: title+' ',
            }})
            echart.setOption(data);
            setTemp(temp - 1);
        }
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
                                                            label={"x坐标"}
                                                            name={[field.name, 'name']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '请输入参数名称',
                                                                },
                                                            ]}
                                                        >
                                                            <InputNumber className={"pie-input1"}/>
                                                        </Form.Item>
                                                    )}
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="y坐标"
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
                                <Button className="BarCharts-form-submit-button" htmlType="button" onClick={goBack}>上一步</Button>
                                <Button className="BarCharts-form-submit-button" type="primary" htmlType="submit">绘制</Button>
                                <Button className="BarCharts-form-submit-button" type="primary" onClick={()=>{setStep(2)}}>完成</Button>
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
                        description: "设置散点值",
                    },
                    {
                        title: '第三步',
                        description: "提交",
                    }
                ]}
            />
            {controlBox()}
            <ReactEcharts  ref={chartRef} className="BarCharts-Charts" option={data} lazyUpdate={false} notMerge={true}/>
            <Modal title="提示" open={isModal} onOk={save} onCancel={handleCancel}>
                您确定要提交吗？
            </Modal>
            {contextHolder}
        </div>
    );
};

export default BarChart;