import React, {useContext, useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Article.css'
import {Button, Input, message, Modal} from "antd";
import axios from "axios";
import url from "../../url";
import {MyContext} from "../../App";


export default function RichEditor() {
    const {userInfo,setUserInfo} = useContext(MyContext);
    const [article, setArticle] = useState({
        txt: '',
        phone: userInfo.phone,
        date: '',
        title: '',
        id: userInfo.id,
        type: 0
    })
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']                                        // remove formatting button
    ];

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

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

    const onEditorChange = (value) => {
        setArticle({...article,txt: value})
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

    return (
        <div className="article">
            <ReactQuill
                value={article.txt}
                onChange={onEditorChange}
                modules={{ toolbar: toolbarOptions}}/>
            <div className={"article-btn-box"}>
                <Button className="article-btn" type="primary" onClick={showModal}>上传</Button>
                <Button className="article-btn" onClick={dele}>删除</Button>
            </div>
            <Modal
                title="提示"
                open={open}
                onOk={save}
                onCancel={hideModal}
                okText="上传"
                cancelText="取消"
            >
                <div className="article-modal-txt">
                    最后一步，请填写您的文章标题，方便查看
                </div>

                <Input placeholder="文章标题" onChange={(event)=>{setArticle({...article,title: event.target.value})}}/>
            </Modal>
            {contextHolder}
        </div>
    )
}

