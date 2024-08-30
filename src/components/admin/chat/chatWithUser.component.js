import React,{useEffect,useState} from 'react';
import Admin from '../../../layouts/admin.layout';
import helpers from '../../../helpers/helper';
import axios from 'axios';
import {io} from 'socket.io-client'
const ChatWithUser = () => {
    const [userConversation,setUserConversation] =  useState({});
    const [conversation,setConversation] =  useState({});
    const keys = {conversationId:'',reply:''};
    const [form,setForm] = useState(keys);

    const socket = io(process.env.REACT_APP_BASE_URL);
    socket.on('connect', ()=>console.log(socket.id))
    socket.on('connect_error', ()=>{
      setTimeout(()=>socket.connect(),5000)
    });

    socket.on('disconnect',()=>setTimeout('server disconnected'));

    socket.on('UserNewMessage',function(){
        // getAllConversations();
        getConversationMessages();
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
    const getConversationMessages = () => {
        const conversationId = conversation.id;
        axios.get(`${process.env.REACT_APP_ADMIN_BASE_URL}/get-conversation-messages/${conversationId}`,helpers.getHeaders()).
        then((resp)=>{
            console.log(resp.data.conversation);
            setConversation(resp.data.conversation);
        }).catch((err)=>{
            console.log(err);
        });
    }
    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm({...form,[name]:value})
    }
    const handleAddMessage = () => {
        form.conversationId = conversation.id;
        axios.post(`${process.env.REACT_APP_ADMIN_BASE_URL}/add-message`,form,helpers.getHeaders()).
        then((resp)=>{
            console.log(resp);
            return;
            // setForm(keys);
        }).catch((err)=>{
            console.log(err);
        });
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
                                                        {/* <div class="status"> <i class="fa fa-circle offline"></i> left 7 mins ago </div> */}
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
                                                <h6 class="m-b-0">Aiden Chavez</h6>
                                                <small>Last seen: 2 hours ago</small>
                                            </div>
                                        </div>
                                        <div class="col-lg-6 hidden-sm text-right">
                                            <a href="javascript:void(0);" class="btn btn-outline-secondary"><i class="fa fa-camera"></i></a>
                                            <a href="javascript:void(0);" class="btn btn-outline-primary"><i class="fa fa-image"></i></a>
                                            <a href="javascript:void(0);" class="btn btn-outline-info"><i class="fa fa-cogs"></i></a>
                                            <a href="javascript:void(0);" class="btn btn-outline-warning"><i class="fa fa-question"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="chat-history">
                                    <ul class="m-b-0">
                                            <li class="clearfix">
                                                <div class="message-data">
                                                    <span class="message-data-time">{conversation?.createdAt}</span>
                                                </div>
                                                <div class="message my-message">{conversation?.title}</div>
                                            </li>
                                        {
                                            conversation?.messages.length>0 &&
                                            conversation?.messages?.map(item=>
                                                <li class="clearfix">
                                                    <div class={`message-data ${item?.userId == helpers.getAdmin() ? 'textEnd':''}`}>
                                                        <span class="message-data-time">{item?.createdAt}</span>
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                    </div>
                                                    <div class={`message other-message ${item?.userId == helpers.getAdmin() ? 'float-right':''}`}> {item?.reply} </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>
                                <div class="chat-message clearfix">
                                    <div class="input-group mb-0">
                                        <div class="input-group-prepend">
                                            <button type='button' class="input-group-text" onClick={handleAddMessage}><i class="fa fa-send"></i></button>
                                        </div>
                                        <input type="text" class="form-control" name="reply" placeholder="Enter text here..." onChange={handleChange} value={form?.reply}/>
                                    </div>
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
