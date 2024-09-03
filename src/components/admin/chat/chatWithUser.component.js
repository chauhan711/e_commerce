import React,{useEffect,useState} from 'react';
import Admin from '../../../layouts/admin.layout';
import helpers from '../../../helpers/helper';
import axios from 'axios';
import {io} from 'socket.io-client';
import Swal from 'sweetalert2';

const ChatWithUser = () => {
    const [userConversation,setUserConversation] =  useState({});
    const [conversation,setConversation] =  useState({});
    const keys = {conversationId:'',reply:'',file:''};
    const [form,setForm] = useState(keys);
    const [image,setImage] = useState(null);

    //for update and delete operation
    const [message,setMessage] = useState(null);
    const [actionMessage,setActionMessage] = useState(null);
    const [updater,setUpdater] = useState(null);

    const socket = io(process.env.REACT_APP_BASE_URL);
    socket.on('connect', ()=>console.log('connect'))
    socket.on('connect_error', ()=>{
      setTimeout(()=>socket.connect(),5000)
    });

    socket.on('disconnect',()=>setTimeout('server disconnected'));

    socket.once('UserNewMessage',function(){
        if(conversation?.id){
            getConversationMessages(conversation?.id);
        }
    });

    const getAllConversations = ()=>{
        axios.get(`${process.env.REACT_APP_ADMIN_BASE_URL}/get-all-conversations`,helpers.getHeaders()).
        then((resp)=>{
            // console.log(resp);
            setUserConversation(resp.data.data);
        }).catch((err)=>{
            console.log(err);
        });
    }
    const getConversationMessages = (conversationId) => {
        axios.get(`${process.env.REACT_APP_ADMIN_BASE_URL}/get-conversation-messages/${conversationId}`,helpers.getHeaders()).
        then((resp)=>{
            console.log(resp);
            setConversation(resp.data.conversation);
        }).catch((err)=>{
            console.log(err);
        });
    }
    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm({...form,[name]:value})
    }
    const handleAddMessage = (e) => {
        e.preventDefault();
        form.conversationId = conversation.id;
        axios.post(`${process.env.REACT_APP_ADMIN_BASE_URL}/add-message`,form,helpers.getFileHeaders()).
        then((resp)=>{
            setForm(keys);
            setImage(null);
        }).catch((err)=>{
            console.log(err);
        });
    }
    const converDateTime = (date) =>{
        // Depending on timezone, your results will vary
        const event = new Date(date);
        return event.toLocaleString('en-US');
    }
    const clickMessage =(id) =>{
        setMessage(id);
        setActionMessage(null);
        setForm(keys);
        setUpdater(null);
    }
    const handleEdit = () => {
        const conMessage = conversation?.messages.map((item)=>{
            if(item?.id === message){
                return item;
            }
            return null
        }).filter(val => val != null);
        setForm(form=>({...form,'reply':conMessage[0].reply}));
        setUpdater(true);
    }
    const updateMessage = () => {
        form.messageId = message;
        axios.post(`${process.env.REACT_APP_ADMIN_BASE_URL}/update-message`,form,helpers.getHeaders()).
        then((resp)=>{
            setForm(keys);
            setMessage(null);
            setActionMessage(null);
            setUpdater(null);
        }).catch((err)=>{
            console.log(err);
        });
        
    }
    const cancelUpdate = () => {
        setUpdater(null);
        setForm(keys);
    }
    const handleDelete = () => {
        Swal.fire({
            title: 'Are you Sure ?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: 'crimson',
            cancelButtonText: "Cancel",
            icon: 'warning'
        }).then((result)=>{
            if(result.value){
                //delete message
                axios.delete(`${process.env.REACT_APP_ADMIN_BASE_URL}/delete-message/${message}`,helpers.getHeaders()).
                then((resp)=>{
                    setForm(keys);
                    setMessage(null);
                    setActionMessage(null);
                    setUpdater(null);
                }).catch((err)=>{
                    console.log(err);
                });
            }
        });
        
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm({...form,file:file});
        setImage(URL.createObjectURL(file));
    }
    useEffect(()=>{
        getAllConversations();
    },[]);
    return (
        <Admin>
            <div class="container">
                <div class="row clearfix mt-5">
                    <div class="col-lg-12">
                        <div class="card chat-app">
                            <div id="plist" class="people-list">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="fa fa-search"></i></span>
                                    </div>
                                    <input type="text" class="form-control" placeholder="Search..." />
                                </div>
                                <ul class="list-unstyled chat-list mt-2 mb-0">
                                    {userConversation?.others_conversation?.length > 0 &&
                                        userConversation?.others_conversation?.map(item=>
                                            <li class="clearfix" onClick={()=>getConversationMessages(item?.id)}>
                                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                                    <div class="about">
                                                        <div class="name">{item?.conversation_user?.name}</div>
                                                        <div class="status"> <i class="fa fa-circle online"></i> online </div>
                                                    </div>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                            {Object.keys(conversation).length>0 &&
                            <div class="chat">
                                <div class="chat-header clearfix">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                                            </a>
                                            <div class="chat-about">
                                                <h6 class="m-b-0">{conversation?.conversation_user?.name}</h6>
                                                <small></small>
                                            </div> 
                                        </div>
                                        <div class="col-lg-6 hidden-sm text-right">
                                            {message && 
                                             <button class="btn btn-outline-warning" onClick={()=>setActionMessage(true)}><i class="fa fa-question"></i></button>
                                            }
                                            {actionMessage &&
                                                <span>
                                                    <button class="btn btn-outline-primary" onClick={()=>handleEdit()}><i class="fa fa-edit"></i></button> 
                                                    <button class="btn btn-outline-primary" onClick={()=>handleDelete()}><i class="fa fa-trash" aria-hidden="true"></i></button> 
                                                </span>
                                             }
                                        </div>
                                    </div>
                                </div>
                                <div class="chat-history">
                                    <ul class="m-b-0">
                                            <li class="clearfix">
                                                <div class="message-data">
                                                    <span class="message-data-time">{converDateTime(conversation?.createdAt)}</span>
                                                </div>
                                                <div class="message my-message">{conversation?.title}</div>
                                            </li>
                                        {
                                            conversation?.messages.length>0 &&
                                            conversation?.messages?.map(item=>
                                                <li class="clearfix">
                                                    <div class={`message-data ${item?.userId == helpers.getAdmin() ? 'textEnd':''}`}>
                                                        <span class="message-data-time">{converDateTime(item?.createdAt)}</span>
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                    </div>
                                                    <div class={`message other-message ${item?.userId == helpers.getAdmin() ? 'float-right':''}`}> <span onClick={()=>clickMessage(item?.id)}> {item?.reply} </span>
                                                    {item?.storages.length > 0 && <span><img alt="preview image" src={`/images/${item?.storages[0].filename}`} style={{width: '10%'}}/> </span>}
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                                <div class="chat-message clearfix">
                                    <div class="input-group mb-0">
                                        <div class="input-group-prepend">
                                            <button type='button' class="input-group-text" onClick={updater? updateMessage : handleAddMessage}><i class="fa fa-send"></i></button>
                                        </div>
                                        <input type="text" class="form-control" name="reply" placeholder="Enter text here..." onChange={handleChange} value={form?.reply}/>
                                        {updater && <button className='btn btn-danger' onClick={cancelUpdate}><i class="fa fa-times" aria-hidden="true"></i></button>}
                                    </div>
                                    <div className='input-group mt-1'>
                                    <input type="file" name="file" onChange={handleFileChange}/>
                                    </div>
                                    {image && <img alt="preview image" src={image} style={{width: '10%'}}/> }
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Admin>
    );
}

export default ChatWithUser;
