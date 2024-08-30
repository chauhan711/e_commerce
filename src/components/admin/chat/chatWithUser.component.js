import React,{useEffect,useState} from 'react';
import Admin from '../../../layouts/admin.layout';
import helpers from '../../../helpers/helper';
import axios from 'axios';
const ChatWithUser = () => {
    const [userConversation,setUserConversation] =  useState({});
    const [conversation,setConversation] =  useState({});

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
            console.log(resp.data.conversation);
            setConversation(resp.data.conversation);
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
                                {Object.keys(conversation).length>0 &&
                                    <ul class="m-b-0">
                                            <li class="clearfix">
                                                <div class="message-data">
                                                    <span class="message-data-time">{conversation?.createdAt}</span>
                                                </div>
                                                <div class="message my-message">{conversation?.title}</div>
                                            </li>
                                        {
                                            conversation?.messages.length>0 &&
                                            <li class="clearfix">
                                                <div class="message-data" style={{textAlign:'end'}}>
                                                    <span class="message-data-time">10:10 AM, Today</span>
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                </div>
                                                <div class="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                                            </li>
                                        }
                                    </ul>
                                }
                                </div>
                                <div class="chat-message clearfix">
                                    <div class="input-group mb-0">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text"><i class="fa fa-send"></i></span>
                                        </div>
                                        <input type="text" class="form-control" placeholder="Enter text here..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Admin>
    );
}

export default ChatWithUser;
